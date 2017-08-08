pragma solidity ^0.4.14;

import '../ResolverClient.sol';

contract ResolverClientTester is ResolverClient {

  function ResolverClientTester(address _resolver)
  {
    init("tester:rc", _resolver);
  }

}
