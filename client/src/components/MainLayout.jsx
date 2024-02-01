import React from "react";

import classes from "./MainLayout.module.css";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <main className={classes.layout_container}>
      <Sidebar />
      <section className={classes.layout_content}>{children}</section>
    </main>
  );
}

export default MainLayout;
