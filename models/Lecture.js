import mongoose from "mongoose"

const schema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String
    },
    isPreviewFree: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })

const Lecture = mongoose.model("Lecture", schema)

export default Lecture;