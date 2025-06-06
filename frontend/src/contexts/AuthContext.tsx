import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

type User = {
  email: string;
  name: string;
  avatar?: string;
};
