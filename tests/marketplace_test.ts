import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can list and buy a story",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    
    // Create and list story
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
      ),
      Tx.contractCall(
        "marketplace",
        "list-story",
        [types.uint(1), types.uint(100)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[1].result.expectOk(), true);
    
    // Buy story
    block = chain.mineBlock([
      Tx.contractCall(
        "marketplace",
        "buy-story",
        [types.uint(1)],
        wallet_2.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), true);
  },
});
