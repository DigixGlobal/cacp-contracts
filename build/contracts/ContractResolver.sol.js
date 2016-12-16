var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("ContractResolver error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("ContractResolver error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("ContractResolver contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of ContractResolver: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to ContractResolver.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: ContractResolver not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [],
        "name": "lockResolver",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "unlockResolver",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_oldadmin",
            "type": "address"
          }
        ],
        "name": "unregisterAdmin",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_contract",
            "type": "address"
          }
        ],
        "name": "registerContract",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_contractaddress",
            "type": "address"
          }
        ],
        "name": "initRegisterContract",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newadmin",
            "type": "address"
          }
        ],
        "name": "registerAdmin",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_group",
            "type": "bytes32"
          },
          {
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "addUserToGroup",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_group",
            "type": "bytes32"
          },
          {
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "isGroupMember",
        "outputs": [
          {
            "name": "_ismember",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "locked",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getContract",
        "outputs": [
          {
            "name": "_contract",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_group",
            "type": "bytes32"
          },
          {
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "delUserFromGroup",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_contractName",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "RegisterEvent",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x60606040526000805460a060020a60ff021916905534610000575b60008054600160a060020a0319166c0100000000000000000000000033808202919091049190911782556003805460ff19908116909155600160a060020a0390911682527f0fc8ddf59641e7be72e107a0d9b00833e92a07d015445b88435be137e1a592dc602090815260408084208054841660019081179091557fb172f69a306eb0ca47ca6ff3dc8b1f3c08531ad5843cfa944c682fac8e9e566e909252909220805490911690911790555b5b610704806100d66000396000f3606060405236156100985760e060020a60003504633bffa5de811461009d57806353998bf9146100be57806354d41bbd146100df578063645c6fae146101035780638da5cb5b1461012a578063ae58b9dd14610153578063c38c58131461017a578063ca54abed1461019e578063cb3022ff146101c5578063cf309012146101ec578063e16c7d981461020d578063fcc1f00114610239575b610000565b34610000576100aa610260565b604080519115158252519081900360200190f35b34610000576100aa6102d3565b604080519115158252519081900360200190f35b34610000576100aa600435610342565b604080519115158252519081900360200190f35b34610000576100aa60043560243561039a565b604080519115158252519081900360200190f35b3461000057610137610471565b60408051600160a060020a039092168252519081900360200190f35b34610000576100aa600435602435610480565b604080519115158252519081900360200190f35b34610000576100aa600435610514565b604080519115158252519081900360200190f35b34610000576100aa600435602435610570565b604080519115158252519081900360200190f35b34610000576100aa6004356024356105ef565b604080519115158252519081900360200190f35b34610000576100aa61061c565b604080519115158252519081900360200190f35b3461000057610137600435610625565b60408051600160a060020a039092168252519081900360200190f35b34610000576100aa600435602435610667565b604080519115158252519081900360200190f35b600160a060020a03331660009081527fb172f69a306eb0ca47ca6ff3dc8b1f3c08531ad5843cfa944c682fac8e9e566e602052604081205460c060020a676e7361646d696e73029060ff1615156102ba57610000566102cd565b6003805460ff1916600190811790915591505b5b5b5090565b600160a060020a03331660009081527fb172f69a306eb0ca47ca6ff3dc8b1f3c08531ad5843cfa944c682fac8e9e566e602052604081205460c060020a676e7361646d696e73029060ff16151561032d57610000566102cd565b6003805460ff19169055600191505b5b5b5090565b6000805433600160a060020a039081169116146103625761000056610393565b50600160a060020a03811660009081526000805160206106e483398151915260205260409020805460ff1916905560015b5b5b919050565b600160a060020a03331660009081527fb172f69a306eb0ca47ca6ff3dc8b1f3c08531ad5843cfa944c682fac8e9e566e602052604081205460c060020a676e7361646d696e73029060ff1615156103f45761000056610468565b600084815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166c01000000000000000000000000878102041790555160019350600160a060020a0385169186917f27e557aefbcc3fa913f6a0f3247454cc65d53c65be8555a10a9dbf48a4d70ec79190a35b5b5b5092915050565b600054600160a060020a031681565b6000805432600160a060020a039081169116146104a0576100005661050d565b6000838152600260205260409020548390600160a060020a0316156104c85761000056610468565b6000848152600260205260409020805473ffffffffffffffffffffffffffffffffffffffff19166c0100000000000000000000000085810204179055600191505b5b5b505b5b92915050565b6000805433600160a060020a039081169116146105345761000056610393565b50600160a060020a03811660009081526000805160206106e483398151915260205260409020805460ff191660019081179091555b5b5b919050565b600160a060020a03331660009081526000805160206106e4833981519152602052604081205460d060020a6561646d696e73029060ff1615156105b65761000056610468565b6000848152600160208181526040808420600160a060020a0388168552909152909120805460ff19168217905591505b5b5b5092915050565b6000828152600160209081526040808320600160a060020a038516845290915290205460ff165b92915050565b60035460ff1681565b600081815260026020526040812054600160a060020a0316151561064857610000565b50600081815260026020526040902054600160a060020a03165b919050565b600160a060020a03331660009081526000805160206106e4833981519152602052604081205460d060020a6561646d696e73029060ff1615156106ad5761000056610468565b6000848152600160208181526040808420600160a060020a0388168552909152909120805460ff1916905591505b5b5b5092915050560fc8ddf59641e7be72e107a0d9b00833e92a07d015445b88435be137e1a592dc",
    "events": {
      "0x27e557aefbcc3fa913f6a0f3247454cc65d53c65be8555a10a9dbf48a4d70ec7": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_contractName",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "RegisterEvent",
        "type": "event"
      }
    },
    "updated_at": 1481851114015
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "ContractResolver";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.ContractResolver = Contract;
  }
})();
