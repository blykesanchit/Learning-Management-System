import Razorpay from "razorpay";

let _rpayInstance = null;

export default function getRpayInstance() {
    if (_rpayInstance) return _rpayInstance;

    const keyId = process.env.RAZORPAY_API_KEY;
    const keySecret = process.env.RAZORPAY_API_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Razorpay keys missing. Ensure env vars are loaded before calling getRpayInstance()");
    }

    _rpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    });

    return _rpayInstance;
}