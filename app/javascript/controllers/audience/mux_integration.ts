import mux from "mux-embed";

export function startMuxData(): void {
  mux.monitor(".player__video", {
    debug: true,
    data: {
      env_key: "pntuujkkd80lvj4poc4hcftg7",
      player_name: "Veue Player",
      player_init_time: globalThis.startLoadTime,
    },
  });
}
