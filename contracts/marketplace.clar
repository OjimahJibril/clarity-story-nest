;; Marketplace Contract
(define-map listings
  uint
  {
    seller: principal,
    price: uint
  }
)

;; List story for sale
(define-public (list-story (story-id uint) (price uint))
  (let
    (
      (owner (unwrap! (nft-get-owner? story story-id) (err u401)))
    )
    (asserts! (is-eq tx-sender owner) (err u403))
    (map-set listings story-id { seller: tx-sender, price: price })
    (ok true)
  )
)

;; Buy story
(define-public (buy-story (story-id uint))
  (let
    (
      (listing (unwrap! (map-get? listings story-id) (err u404)))
      (price (get price listing))
      (seller (get seller listing))
    )
    (try! (stx-transfer? price tx-sender seller))
    (try! (nft-transfer? story story-id seller tx-sender))
    (map-delete listings story-id)
    (ok true)
  )
)
