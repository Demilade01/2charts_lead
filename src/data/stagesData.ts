export interface StageData {
  value: number;
  name: string;
}

export interface StagesData {
  [key: string]: StageData;
}

export interface SemesterDataMap {
  [key: string]: StagesData;
}

export const semesters = [
  {
    value: "spring25",
    label: "Spring '25",
  },
  {
    value: "fall25",
    label: "Fall '25",
  },
  {
    value: "winter25",
    label: "Winter '25",
  },
];

const spring25Data: StagesData = {
  discovery: { value: 156, name: "Discovery/Dev" },
  started: { value: 91, name: "App Started" },
  submitted: { value: 86, name: "App Submitted" },
  complete: { value: 75, name: "App Complete" },
  offered: { value: 67, name: "Admission Offered" },
  accepted: { value: 65, name: "Admission Accepted" },
  enrolled: { value: 60, name: "Enrolled" },
};

const fall25Data: StagesData = {
  discovery: { value: 180, name: "Discovery/Dev" },
  started: { value: 120, name: "App Started" },
  submitted: { value: 105, name: "App Submitted" },
  complete: { value: 95, name: "App Complete" },
  offered: { value: 85, name: "Admission Offered" },
  accepted: { value: 78, name: "Admission Accepted" },
  enrolled: { value: 70, name: "Enrolled" },
};

const winter25Data: StagesData = {
  discovery: { value: 130, name: "Discovery/Dev" },
  started: { value: 85, name: "App Started" },
  submitted: { value: 75, name: "App Submitted" },
  complete: { value: 65, name: "App Complete" },
  offered: { value: 55, name: "Admission Offered" },
  accepted: { value: 50, name: "Admission Accepted" },
  enrolled: { value: 45, name: "Enrolled" },
};

export const semesterDataMap: SemesterDataMap = {
  spring25: spring25Data,
  fall25: fall25Data,
  winter25: winter25Data,
};

export const defaultStagesData = spring25Data;
