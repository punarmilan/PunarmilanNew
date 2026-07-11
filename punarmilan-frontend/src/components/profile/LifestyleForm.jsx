import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import api from "../../services/api";

import {
  Heart,
  CalendarDays,
  Cake,
  Ruler,
  Weight,
  Utensils,
  Wine,
  Cigarette,
  Droplets,
  ShieldPlus,
  Accessibility,
  Music,
  Sparkles,
} from "lucide-react";

export default function LifestyleForm({ onNext }) {

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {

    try {

      await api.patch(
        "/profiles/me",
        data
      );

      onNext();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        bg-white/90
        backdrop-blur-xl
        rounded-[32px]
        border
        border-pink-100
        shadow-2xl
        overflow-hidden
      "
    >

      {/* TOP GRADIENT */}
      <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400"></div>

      <div className="p-8 md:p-10">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">

          <div className="
            w-16
            h-16
            rounded-3xl
            bg-gradient-to-r
            from-pink-500
            to-rose-500
            flex
            items-center
            justify-center
            shadow-lg
          ">
            <Heart className="text-white" size={30} />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Lifestyle & Personality
            </h2>

            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Express your personality, lifestyle & interests
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* AGE */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Cake size={16} />
                Age
              </label>

              <input
                type="number"
                placeholder="Enter age"
                {...register("age")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                "
              />
            </div>

            {/* DOB */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <CalendarDays size={16} />
                Date Of Birth
              </label>

              <input
                type="date"
                {...register("dob")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                "
              />
            </div>

            {/* MARITAL STATUS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Heart size={16} />
                Marital Status
              </label>

              <select
                {...register("maritalStatus")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Status</option>

                <option>Never Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
                <option>Awaiting Divorce</option>

              </select>
            </div>

            {/* HEIGHT */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Ruler size={16} />
                Height
              </label>

              <select
                {...register("height")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Height</option>

                <option>4ft 10in</option>
                <option>5ft 0in</option>
                <option>5ft 2in</option>
                <option>5ft 4in</option>
                <option>5ft 6in</option>
                <option>5ft 8in</option>
                <option>6ft 0in</option>

              </select>
            </div>

            {/* WEIGHT */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Weight size={16} />
                Weight
              </label>

              <input
                type="text"
                placeholder="55 KG"
                {...register("weight")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                "
              />
            </div>

            {/* DIET */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Utensils size={16} />
                Diet Preference
              </label>

              <select
                {...register("diet")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Diet</option>

                <option>Vegetarian</option>
                <option>Non Vegetarian</option>
                <option>Eggetarian</option>
                <option>Jain</option>
                <option>Vegan</option>

              </select>
            </div>

            {/* DRINKING */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Wine size={16} />
                Drinking Habit
              </label>

              <select
                {...register("drinkingHabit")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Habit</option>

                <option>No</option>
                <option>Occasionally</option>
                <option>Socially</option>
                <option>Yes</option>

              </select>
            </div>

            {/* SMOKING */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Cigarette size={16} />
                Smoking Habit
              </label>

              <select
                {...register("smokingHabit")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Habit</option>

                <option>No</option>
                <option>Occasionally</option>
                <option>Socially</option>
                <option>Yes</option>

              </select>
            </div>

            {/* BLOOD GROUP */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Droplets size={16} />
                Blood Group
              </label>

              <select
                {...register("bloodGroup")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Blood Group</option>

                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>

              </select>
            </div>

            {/* HEALTH */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <ShieldPlus size={16} />
                Health Information
              </label>

              <input
                type="text"
                placeholder="No health issues"
                {...register("healthInformation")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                "
              />
            </div>

            {/* DISABILITY */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Accessibility size={16} />
                Disability
              </label>

              <select
                {...register("disability")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  text-gray-700
                "
              >
                <option value="">Select Option</option>

                <option>None</option>
                <option>Physical Disability</option>
                <option>Hearing Disability</option>
                <option>Visual Disability</option>
                <option>Other</option>

              </select>
            </div>

            {/* HOBBIES */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Music size={16} />
                Hobbies & Interests
              </label>

              <input
                type="text"
                placeholder="Music, Travel, Reading, Cooking..."
                {...register("hobbies")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                "
              />
            </div>

            {/* ABOUT */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Sparkles size={16} />
                About Yourself
              </label>

              <textarea
                rows="6"
                placeholder="Write something about yourself, personality, goals & interests..."
                {...register("aboutText")}
                className="
                  w-full
                  p-5
                  rounded-3xl
                  border border-gray-200
                  bg-gray-50
                  focus:bg-white
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  resize-none
                "
              />
            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end pt-4">

            <button
              type="submit"
              className="
                px-10
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-pink-500
                to-rose-500
                text-white
                font-semibold
                text-lg
                shadow-lg
                hover:scale-105
                hover:shadow-pink-300
                active:scale-95
                transition-all
                duration-300
              "
            >
              Save & Continue
            </button>

          </div>

        </form>

      </div>

    </motion.div>
  );
}