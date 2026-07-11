import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherUsersThunk,
  logoutUserThunk,
} from "../../store/slice/user/user.thunk";

const UserSidebar = () => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);

  const { otherUsers, userProfile } = useSelector(
    (state) => state.userReducer
  );

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
  };

  useEffect(() => {
    if (!searchValue) {
      setUsers(otherUsers || []);
    } else {
      setUsers(
        (otherUsers || []).filter((user) => {
          return (
            user.username
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            user.fullName
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        })
      );
    }
  }, [searchValue, otherUsers]);

  useEffect(() => {
    dispatch(getOtherUsersThunk());
  }, [dispatch]);

  return (
    <div className="w-full md:max-w-[20rem] h-[100dvh] flex flex-col border-r border-white/10 bg-base-100 overflow-hidden">

      {/* Logo */}
<div className="bg-black rounded-xl px-4 m-2 py-3 w-[95%] mx-auto">
  <h1 className="text-[#7480FF] text-[15px] font-bold leading-none">
    MEHFIL
  </h1>

  <p className="text-gray-400 text-xl font-bold mt-1">
    Connect Freely
  </p>
</div>

      {/* Search */}
      <div className="px-3 pb-3">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Search"
            className="grow"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IoSearch size={20} />
        </label>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 min-h-0">
        {users?.length > 0 ? (
          users.map((userDetails) => (
            <User
              key={userDetails._id}
              userDetails={userDetails}
            />
          ))
        ) : (
          <div className="text-center mt-10 opacity-60">
            No users found
          </div>
        )}
      </div>

      {/* Bottom Profile */}
      <div className="border-t border-white/10 p-3 flex items-center justify-between bg-base-100">

        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img className=" bg-slate-500"
                src={userProfile?.avatar}
                alt={userProfile?.username}
              />
            </div>
          </div>

          <div>
            <h2 className="font-semibold">
              {userProfile?.fullName}
            </h2>

            <p className="text-xs opacity-60">
              @{userProfile?.username}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-primary btn-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default UserSidebar;