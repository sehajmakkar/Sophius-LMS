import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, ""],
      trim: true,
      maxLength: [100, ""],
    },
    subtitle: {
      type: String,
      trim: true,
      maxLength: [200, ""],
    },
    description: {
      type: String,
      required: [true, ""],
      trim: true,
      maxLength: [500, ""],
    },
    category: {
      type: String,
      required: [true, ""],
      trim: true,
    },
    level: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "please select a valid level",
      },
      default: "beginner",
    },
    price: {
      type: Number,
      required: [true, ""],
      min: [0, ""],
    },
    thumbnail: {
      type: String,
      required: [true, ""],
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, ""],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual('averageRating').get(function(){
  return 0; // assignment
})

courseSchema.pre('save', function (next) {
  if(this.lectures){
    this.totalLectures = this.lectures.length
  }

  next();
})

export const Course = mongoose.model("Course", courseSchema);