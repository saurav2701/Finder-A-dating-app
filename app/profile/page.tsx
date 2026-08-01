"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gender } from "../generated/prisma/enums";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "MALE",
    bio: "",
    jobTitle: "",
    school: "",
    locationName: "",
    interestedIn: [] as ("MALE" | "FEMALE" | "NON_BINARY" | "OTHER")[],
    minAgePref: 18,
    maxAgePref: 99,
    maxDistanceKm: 50,
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (res.ok && data.profile) {
          setForm({
            name: data.profile.name ?? "",
            birthdate: data.profile.birthdate
              ? data.profile.birthdate.slice(0, 10) // "2005-03-30T00:00:00.000Z" -> "2005-03-30"
              : "",
            gender: data.profile.gender ?? "MALE",
            bio: data.profile.bio ?? "",
            jobTitle: data.profile.jobTitle ?? "",
            school: data.profile.school ?? "",
            locationName: data.profile.locationName ?? "",
            interestedIn: data.profile.interestedIn?.[0] ?? "MALE",
            minAgePref: data.profile.minAgePref ?? 18,
            maxAgePref: data.profile.maxAgePref ?? 99,
            maxDistanceKm: data.profile.maxDistanceKm ?? 50,
          });
        }
      } catch (err) {
        // no existing profile or fetch failed — leave defaults, not fatal
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, interestedIn: [form.interestedIn] }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }
      router.push("/");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white">
      <h1 className="text-2xl font-bold text-black mb-8">
        Complete Your Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="name" className="font-medium text-gray-900">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Birthdate */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="birthdate" className="font-medium text-gray-900">
            Birthdate
          </label>
          <input
            id="birthdate"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            type="date"
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Gender */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="gender" className="font-medium text-gray-900">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NON_BINARY">Non-binary</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Bio */}
        <div className="grid grid-cols-3 gap-4">
          <label htmlFor="bio" className="pt-2 font-medium text-gray-900">
            Bio
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={handleChange}
            name="bio"
            rows={4}
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Job Title */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="jobTitle" className="font-medium text-gray-900">
            Job Title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            type="text"
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* School */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="school" className="font-medium text-gray-900">
            School
          </label>
          <input
            id="school"
            value={form.school}
            onChange={handleChange}
            name="school"
            type="text"
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="locationName" className="font-medium text-gray-900">
            Location
          </label>
          <input
            id="locationName"
            value={form.locationName}
            onChange={handleChange}
            name="locationName"
            type="text"
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Interested In */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="interestedIn" className="font-medium text-gray-900">
            Interested In
          </label>
          <select
            id="interestedIn"
            value={form.interestedIn}
            onChange={handleChange}
            name="interestedIn"
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          >
            <option value="MALE">Men</option>
            <option value="FEMALE">Women</option>
            <option value="NON_BIANARY">Non bianary</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Minimum Age Preference */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="minAgePref" className="font-medium text-gray-900">
            Min Age Preference
          </label>
          <input
            id="minAgePref"
            value={form.minAgePref}
            onChange={handleChange}
            name="minAgePref"
            type="number"
            min={18}
            defaultValue={18}
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Maximum Age Preference */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="maxAgePref" className="font-medium text-gray-900">
            Max Age Preference
          </label>
          <input
            id="maxAgePref"
            value={form.maxAgePref}
            onChange={handleChange}
            name="maxAgePref"
            type="number"
            min={18}
            max={99}
            defaultValue={99}
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Maximum Distance */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="maxDistanceKm" className="font-medium text-gray-900">
            Max Distance (km)
          </label>
          <input
            id="maxDistanceKm"
            name="maxDistanceKm"
            type="number"
            value={form.maxDistanceKm}
            onChange={handleChange}
            min={1}
            defaultValue={50}
            className="col-span-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black"
          />
        </div>

        {/* Submit */}
        <div className="grid grid-cols-3 gap-4">
          <div />
          <button
            type="submit"
            className="col-span-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {loading ? "Submitting...." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
