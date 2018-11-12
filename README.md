# Digix Contract Access Control Patterns

[Documenation](https://digixglobal.github.io/cacp-contracts/)

A sample module using truffle's fancy npm functionality.

```
npm install --save @digix/cacp-contracts
```

That's right, you can now add Solidity contracts to your project using NPM, and it knows which address to use in your project depending on the chain!

### WARNING:
* function `is_contract` and modifiers `if_contract`, `unless_contract` in `ACConditions` will not work correctly when called from the constructor of the contract itself. Please beware of this fact when using these functions.

---
Join our online chat at [![Gitter](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/DigixGlobal/devtools)

TODO: Readme
