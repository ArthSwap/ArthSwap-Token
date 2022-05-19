const ArthSwapToken = artifacts.require("ArthSwapToken");
const truffleAssert = require('truffle-assertions');
const BigNumber = require('bignumber.js');

contract("ArthSwapToken", (accounts) => {
    it("mint by owner", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const account = accounts[0];
        const amount = 1000;
        await tokenInstance.mint(account, amount);
        let afterMintAmount = (await tokenInstance.balanceOf.call(account)).toNumber();
        assert.equal(amount, afterMintAmount);
    });

    it("mint from not owner", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const account = accounts[1];
        const amount = 1;
        await truffleAssert.reverts(tokenInstance.mint(account, amount, { from: account }),
            "Ownable: caller is not the owner"
        );
    });

    it("mint over maxSupply", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const account = accounts[0];
        const amount = new BigNumber(1000000000e19);
        await truffleAssert.reverts(tokenInstance.mint(account, amount, { from: account }));
    });

    it("transfer before getting transferable", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const account = accounts[0];
        const toaccount = accounts[1]
        const amount = 1;
        await tokenInstance.mint(account, amount);
        await truffleAssert.reverts(tokenInstance.transfer(toaccount, amount),
            "Can Not Transfer"
        );
    });

    it("transferfrom before getting transferable", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const spender = accounts[0];
        const fromaccount = accounts[1]
        const toaccount = accounts[1]
        const amount = 1;
        await tokenInstance.mint(spender, amount);
        await tokenInstance.approve(spender, amount, { from: fromaccount });
        await truffleAssert.reverts(tokenInstance.transferFrom(fromaccount, toaccount, amount),
            "Can Not Transfer"
        );
    });

    it("try transferable by not owner", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const account = accounts[1];
        await truffleAssert.reverts(tokenInstance.toTransferable({ from: account }),
            "Ownable: caller is not the owner"
        );
    });

    it("try transferable by owner", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const isTransferableBefore = await tokenInstance.transferable();
        await tokenInstance.toTransferable();
        const isTransferableAfter = await tokenInstance.transferable();
        assert.notEqual(isTransferableBefore, isTransferableAfter);
    });

    it("transfer after getting transferable", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const account = accounts[0];
        const toaccount = accounts[1]
        const amount = 1;
        await tokenInstance.mint(account, amount);
        await tokenInstance.toTransferable();
        await tokenInstance.transfer(toaccount, amount);
        let afterTransferAmount = (await tokenInstance.balanceOf.call(toaccount)).toNumber();
        assert.equal(afterTransferAmount, amount);
    });

    it("transferfrom after getting transferable", async () => {
        const tokenInstance = await ArthSwapToken.deployed();
        const spender = accounts[0];
        const fromaccount = accounts[1]
        const toaccount = accounts[1]
        const amount = 1;
        await tokenInstance.mint(spender, amount);
        await tokenInstance.toTransferable();
        await tokenInstance.approve(spender, amount, { from: fromaccount });
        await tokenInstance.transferFrom(fromaccount, toaccount, amount);
        let afterTransferAmount = (await tokenInstance.balanceOf.call(toaccount)).toNumber();
        assert.equal(afterTransferAmount, amount);
    });
}); 