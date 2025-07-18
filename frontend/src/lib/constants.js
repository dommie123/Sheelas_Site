export const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "jfif",
    "pjpeg",
    "pjp",
    "webp",
    "avif",
    "apng",
    "svg"
]

export const PASS_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

export const SELLER_PLAN_OPTIONS = [
    {id: 1, stripe_id: "prod_SgamChvdXzwun4", name: "Individual", price: "$4.99", rateType: "mo", details: [
        "Limit of 100 item listings",
        "Limit of $5,000 per listing",
        "Fixed rate of $4.99 per month",
        "Inactive account is reverted after 1 year"
    ]},
    {id: 2, stripe_id: "prod_SaFlj4GP1OuUIm", name: "Business", price: "$29.99", rateType: "mo", details: [
        "Limit of 200 item listings",
        "Limit of $10,000 per listing",
        "Fixed rate of $29.99 per month",
        "Account remains active until cancelled or deleted"
    ]}, // mo = month  
]