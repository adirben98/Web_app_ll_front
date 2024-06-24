import React, { useEffect, useState } from "react";
import "../CSS/profile.css";
import { useParams } from "react-router-dom";
import User from "../Services/user-service";
//import { useParams } from 'react-router-dom';

export default function ProfilePage() {
  enum favorites{
    foodNow,
    theMeal
  }
  
  const [activeTab, setActiveTab] = useState<favorites>(favorites.foodNow);
  //const {id}=useParams()
  const [image, setImage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  

  async function fetchProfile() {
    const user = User.getUser();
    setImage(user.userImg!);
    setUsername(user.username!);
    setEmail(user.email!);
  }
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="row" style={{ width: "100%", maxWidth: "1000px" }}>
        <div className="col-xl-8 mx-auto">
          <div className="card">
            <div className="card-body pb-0">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div
                    className="text-center border-end"
                    style={{ padding: "20px" }}
                  >
                    <img
                      src={image}
                      className="img-fluid avatar-xxl rounded-circle"
                      alt="Profile"
                      style={{ width: "120px", height: "120px" }}
                    />
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="ms-3">
                    <div className="row my-4">
                      <div className="col-md-12">
                        <div>
                          <h4 className="text-primary font-size-20" style={{padding:"6px"}}>
                            {username}
                          </h4>
                          <p className="text-muted fw-medium mb-0">
                            <i className="mdi mdi-email-outline me-2"></i>
                            {"email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul
                      className="nav nav-tabs nav-tabs-custom border-bottom-0 mt-3 nav-justified"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link px-4 active"
                          data-bs-toggle="tab"
                          href="#projects-tab"
                          role="tab"
                          aria-selected="false"
                          tabIndex={-1}
                        >
                          <span className="d-block d-sm-none">
                            <i className="fas fa-home"></i>
                          </span>
                          <span className="d-none d-sm-block">"Food-Now" Favorites</span>
                        </a>
                      </li>
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link px-4"
                          href=""
                          target="__blank"
                        >
                          <span className="d-block d-sm-none">
                            <i className="mdi mdi-menu-open"></i>
                          </span>
                          <span className="d-none d-sm-block">"The-Meal" Favorites</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {activeTab === favorites.foodNow ?(
          <ul className="nav nav-tabs nav-tabs-custom border-bottom-0 mt-3 nav-justfied" role="tablist">
            </ul>
        ):(<div></div>)}
        </div>
      </div>
    </div>
  );
}
