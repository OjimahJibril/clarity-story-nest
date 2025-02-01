;; Story NFT Contract
(define-non-fungible-token story uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-owner (err u100))
(define-constant err-story-exists (err u101))
(define-constant err-story-not-found (err u102))

;; Data variables
(define-map story-metadata
  uint
  {
    creator: principal,
    title: (string-utf8 100),
    description: (string-utf8 500),
    content-uri: (string-utf8 200),
    likes: uint,
    created-at: uint
  }
)

(define-data-var last-story-id uint u0)

;; Create new story
(define-public (create-story (title (string-utf8 100)) (description (string-utf8 500)) (content-uri (string-utf8 200)))
  (let
    (
      (story-id (+ (var-get last-story-id) u1))
    )
    (try! (nft-mint? story story-id tx-sender))
    (map-set story-metadata story-id {
      creator: tx-sender,
      title: title,
      description: description,
      content-uri: content-uri,
      likes: u0,
      created-at: block-height
    })
    (var-set last-story-id story-id)
    (ok story-id)
  )
)

;; Like a story
(define-public (like-story (story-id uint))
  (let
    (
      (story (unwrap! (map-get? story-metadata story-id) (err err-story-not-found)))
    )
    (map-set story-metadata story-id (merge story { likes: (+ (get likes story) u1) }))
    (ok true)
  )
)

;; Get story details
(define-read-only (get-story (story-id uint))
  (map-get? story-metadata story-id)
)
