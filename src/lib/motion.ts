export const ease=[0.22,1,0.36,1] as const;
export const transitions={micro:{duration:.15,ease},hover:{duration:.17,ease},press:{duration:.14,ease},standard:{duration:.22,ease},surface:{duration:.27,ease},reveal:{duration:.22,ease},workflow:{duration:.32,ease},page:{duration:.32,ease}};
export const pageReveal={initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:transitions.page};
