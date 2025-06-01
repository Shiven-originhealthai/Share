import { create } from 'zustand';

type Post= {
  isposting:boolean,
  Shared:(value:boolean)=>void;
};

export const usePosting = create<Post>((set) => ({
    isposting:false,
    Shared:(value:boolean)=>set({isposting:value})

}));
