import React from "react";
import Onboarding from "../src/screens/Onboarding";

export default function Index() {
  return <Onboarding onFinish={() => console.log("Onboarding completado")} />;
}