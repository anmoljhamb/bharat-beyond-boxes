import { BForm } from "../components/Form";
import React, { useContext, useState } from "react";
import {
  AutoCompleteOption,
  BTouristPref,
  Destination,
  InitialValuesInterface,
} from "../types";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts";
import { db } from "../firebase";
import { MessageContext } from "../contexts/MessageContext";
import { useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const languages: string[] = ["English", "Hindi", "Tamil", "French", "Spanish"];
const destinations: Destination[] = [
  "Delhi",
  "Rajasthan",
  "Himachal Pradesh",
  "Uttar Pradesh",
  "Tamil Nadu",
];

const TouristPerf = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showMessage } = useContext(MessageContext)!;
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof language>) => {
    const {
      target: { value },
    } = event;
    setLanguage(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const initValues: InitialValuesInterface = {
    foodHabits: "",
    familyMembers: "",
    destination: "",
    price: "",
    comfortableHosting: "",
  };

  return (
    <section className="pt-14">
      <div className="w-[60%] h-screen justify-center items-center flex flex-col mx-auto">
        <h1 className="text-3xl text-center">
          <span className="capitalize">{auth.userDetails!.role} </span>
          Preferences Form
        </h1>
        <BForm
          buttonText="Save Details"
          loading={isLoading}
          initialValues={initValues}
          extendForm={
            <>
              <InputLabel id="demo-multiple-checkbox-label">
                Languages
              </InputLabel>
              <Select
                className="my-2 w-full"
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={language}
                onChange={handleChange}
                input={<OutlinedInput label="Languages" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {languages.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={language.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </>
          }
          formFields={[
            {
              name: "comfortableHosting",
              label: "Number of people you'd be comfortable with staying",
              type: "text",
            },
            {
              name: "price",
              label: "Price Per Day",
              type: "text",
            },
            {
              name: "familyMembers",
              label: "Number of people you are travelling with",
              type: "text",
            },
            {
              name: "destination",
              label: "Destination",
              type: "option",
              choices: destinations.map((desti) => {
                return {
                  label: desti,
                  value: desti,
                } satisfies AutoCompleteOption;
              }),
            },
            {
              name: "foodHabits",
              label: "Food Habits",
              type: "option",
              choices: [
                {
                  label: "Non-Veg",
                  value: "non-veg",
                },
                {
                  label: "Veg",
                  value: "veg",
                },
                {
                  label: "Vegan",
                  value: "vegan",
                },
              ],
            },
          ]}
          onSubmit={async (values) => {
            console.log(values);
            setIsLoading(true);
            try {
              const userPref: BTouristPref = {
                uid: auth.currentUser!.uid,
                role: auth.userDetails!.role,
                price: Number.parseFloat(values.price),
                languages: language,
                foodHabits: values.foodHabits as "non-veg" | "veg" | "vegan",
                destination: values.destination as Destination,
                familyMembers: Number.parseInt(values.familyMembers),
                comfortableHosting: Number.parseInt(values.comfortableHosting),
              };
              await setDoc(
                doc(db, "userPref", auth.currentUser!.uid),
                userPref,
              );
              auth.setUserPref(userPref);
              showMessage("User Pref saved successfully!", "success");
              setTimeout(() => {
                navigate("/connect");
              }, 1000);
            } catch (error) {
              console.error(error);
            }
            setIsLoading(false);
          }}
        />
      </div>
    </section>
  );
};

export default TouristPerf;
