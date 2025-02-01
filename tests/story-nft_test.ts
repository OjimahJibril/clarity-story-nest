import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can create a new story",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    let block = chain.mineBlock([
      Tx.contractCall(
        "story-nft",
        "create-story",
        [
          types.utf8("Test Story"),
          types.utf8("Test Description"),
          types.utf8("https://story.content/123")
        ],
        wallet_1.address
      )
    ]);
    assertEquals(block.receipts[0].result.expectOk(), "u1");
  },
});

Clarinet.test({
  name: "Can like a story",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    let block = chain.mineBlock([
      Tx.contractCall("story-nft", "like-story", [types.uint(1)], wallet_1.address)
    ]);
    assertEquals(block.receipts[0].result.expectOk(), true);
  },
});
