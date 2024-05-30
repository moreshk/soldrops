"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

const Page = () => {
  const [value, setValue] = useState("");
  return (
    <div className="h-screen bg-white bg bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="text-center py-10">
        <p className="text-4xl font-medium">Soldrops Embed Example</p>
        <p>preview of how the website will look if it has website Embed</p>
      </div>
      <div className="max-w-sm mx-auto">
        <Input
          placeholder="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {value && (
        <div className="max-w-lg rounded-lg mx-auto mt-10">
          <iframe
            src={value}
            width="100%"
            height="700px"
            className=" rounded-2xl"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Page;
