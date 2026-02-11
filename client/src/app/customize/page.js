import { Suspense } from "react";
import CustomizeClient from "./Customize";
import Loader from "@/app/_components/Loader";

export default function CustomizePage() {
  return (
    <Suspense fallback={<Loader/>}>
      <CustomizeClient />
    </Suspense>
  );
}