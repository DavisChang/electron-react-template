import dns from "dns";
import { dialog } from "electron";

// check internet
let lastStatus: boolean = true;

export function checkInternetConnection(): void {
  dns.lookup("google.com", (err: NodeJS.ErrnoException | null) => {
    const isOnline = !err;
    if (isOnline !== lastStatus) {
      lastStatus = isOnline;
      const message = isOnline ? "You are now online." : "You are offline.";
      dialog.showMessageBox({
        type: "info",
        title: "Network Status",
        message,
      });
    }
  });
}
