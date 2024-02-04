import React, { useContext, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/user.context";
import { makeRequest } from "../utils/axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import InputBox from "../components/Input.component";
import { storeInSession } from "../common/session";

const profileDummyDataStructure = {
  personal_info: {
    fullName: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
  likedBlogs: [],
  blogs: [],
};

const EditProfile = () => {
  const {
    userAuth: { username },
    userAuth,
    setUserAuth,
  } = useContext(UserContext);
  const bioCharLimit = 200;
  const queryClient = useQueryClient();

  const [bioArea, setBioArea] = useState("");
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

  const formDataRef = useRef();

  /*====================== INPUTS HANDLERS ======================== */

  const profileImgChangeHandler = (e) => {
    const img = e.target.files[0];
    setUpdatedProfileImg(img);
  };
  /*================= MUTATION FOR UPDATE PROFILE ================== */

  const { mutate, isPending: isUploadPending } = useMutation({
    mutationFn: (userData) => {
      if (userData.type === "imageUpload") {
        return makeRequest.post("/users/upload-profile-image", userData);
      } else if (userData.type === "infoUpdate") {
        return makeRequest.put("/users/update-profile-info", userData);
      }
    },
    onSuccess: (response) => {
      const { data } = response;

      // after uploaded profile image
      if (data?.profileImg) {
        toast.success("Profile image has been uploaded successfully.");
        let newUserAuth = { ...userAuth, profile_img: data.profileImg };
        storeInSession("user", JSON.stringify(newUserAuth));
        setUserAuth(newUserAuth);
        setUpdatedProfileImg(null);

        // after updated profile information
      } else if (data?.username) {
        toast.success("Profile Info Updated successfully.");
        if (userAuth.username !== data?.username) {
          let newUserAuth = { ...userAuth, username: data?.username };
          storeInSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
          formDataRef.current.reset();
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["users", username],
      });
    },
    onError: (error) => {
      const err =
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong.";
      console.log(err);
      toast.error(err);
    },
  });

  /*====================== UPLOAD IMAGE FUN ======================== */

  const upload = async (image) => {
    try {
      const formData = new FormData();

      formData.append("image", image);

      const res = await makeRequest.post("/upload", formData);

      return res.data;
    } catch (error) {
      console.log(error);
      const err = error.response.data.error || "Image upload failed.";
      toast.error(err);
    }
  };

  const uploadProfileImgHandler = async (e) => {
    e.preventDefault();
    if (!updatedProfileImg) {
      return toast.error("Please select a new profile image file first.");
    }

    let imageUrl = await upload(updatedProfileImg);

    if (imageUrl.length) {
      mutate({
        type: "imageUpload",
        profileImg: `/uploads/${imageUrl}`,
      });
    }
  };

  /*====================== UPDATE PROFILE DATA ======================== */

  const updateProfileDataHandler = (e) => {
    e.preventDefault();

    const form = new FormData(formDataRef.current);
    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    // console.log(formData);

    let {
      bio,
      facebook,
      github,
      instagram,
      twitter,
      username,
      website,
      youtube,
    } = formData;

    if (username.length < 3) {
      return toast.error("Please enter a username at least 3 characters");
    }
    if (bio.length > bioCharLimit) {
      return toast.error(
        `You can only write ${bioCharLimit} characters in bio.`
      );
    }

    mutate({
      type: "infoUpdate",
      username,
      bio,
      social_links: {
        facebook,
        github,
        instagram,
        twitter,
        website,
        youtube,
      },
    });
  };

  /*====================== GET USER PROFILE DATA ======================== */

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["users", username],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/get-user/${username}`);
      return res.data;
    },
    enabled: !!username,
  });

  // console.log(user);

  const {
    personal_info: {
      fullName,
      email,
      username: profile_username,
      profile_img,
      bio,
    },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = user || profileDummyDataStructure;

  const isBackendProfileImg =
    typeof profile_img === "string" && profile_img.includes("/uploads");

  /*====================== JSX ======================== */

  return (
    <AnimationWrapper>
      {isPending ? (
        <Loader />
      ) : (
        !error &&
        user && (
          <form className="py-4 md:mt-0  center" ref={formDataRef}>
            <Toaster />
            <h1 className="max-md:hidden mb-6 text-2xl font-medium text-center">
              Edit Profile
            </h1>
            <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-16">
              <div className="mb-5 max-lg:center flex-shrink-0 lg:mt-6">
                <label htmlFor="profileImg" className="relative center">
                  <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/50 opacity-0 hover:opacity-100 cursor-pointer rounded-full">
                    Upload Image
                  </div>
                  <img
                    src={
                      isBackendProfileImg
                        ? import.meta.env.VITE_HOST_URL + profile_img
                        : updatedProfileImg
                        ? URL.createObjectURL(updatedProfileImg)
                        : profile_img
                    }
                    alt="profile image"
                    className="w-40 h-40 bg-grey rounded-full border border-grey cursor-pointer"
                  />
                </label>
                <input
                  type="file"
                  name="profileImg"
                  id="profileImg"
                  accept=".jpeg, .png, .jpg"
                  hidden
                  onChange={profileImgChangeHandler}
                />
                <button
                  className="btn-light mt-5 max-lg:center lg:w-full px-10"
                  onClick={uploadProfileImgHandler}
                  type="button"
                  disabled={isUploadPending}
                >
                  {updatedProfileImg && isUploadPending
                    ? "Uploading..."
                    : "Upload"}
                </button>
              </div>

              {/* Form for edit profile data */}

              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                  <div>
                    <InputBox
                      name={"fullName"}
                      type={"text"}
                      value={fullName}
                      placeholder={"Enter Your FullName"}
                      disabled={true}
                      iconName={"fi-rr-user"}
                    />
                  </div>
                  <div>
                    <InputBox
                      name={"email"}
                      type={"email"}
                      value={email}
                      placeholder={"Enter Your Email"}
                      disabled={true}
                      iconName={"fi-rr-envelope"}
                    />
                  </div>
                </div>
                <InputBox
                  name={"username"}
                  type={"text"}
                  value={profile_username}
                  placeholder={"Enter Your Unique Username"}
                  iconName={"fi-rr-at"}
                />
                <p className="text-dark-grey text-[13px] -mt-4 ml-2">
                  Username will be use to search user and will be visible to all
                  users
                </p>

                <textarea
                  name="bio"
                  id="bio"
                  maxLength={bioCharLimit}
                  defaultValue={bio}
                  placeholder="Enter Your bio"
                  className="input-box h-48 lg:h-40 resize-none leading-7 mt-5  p-3 pl-5"
                  onChange={(e) =>
                    setBioArea(e.target.value.slice(0, bioCharLimit))
                  }
                ></textarea>
                <p className="text-dark-grey text-right text-[13px] mr-2 -mt-1">
                  {bioCharLimit}/{bioCharLimit - bioArea.length} Characters Left
                </p>

                <p className="my-6 ">Add your social handles below</p>
                <div className="md:grid md:grid-cols-2 gap-x-6">
                  {Object.keys(social_links).map((key, idx) => {
                    let link = social_links[key];

                    return (
                      <InputBox
                        key={idx}
                        value={link}
                        name={key}
                        type={"text"}
                        placeholder={"https://..."}
                        iconName={
                          key !== "website"
                            ? `fi-brands-${key.toLowerCase()}`
                            : "fi-rs-globe"
                        }
                      />
                    );
                  })}
                </div>
                <button
                  className="btn-dark w-auto px-10 center mt-6"
                  type="submit"
                  onClick={updateProfileDataHandler}
                  disabled={isUploadPending}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        )
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;
