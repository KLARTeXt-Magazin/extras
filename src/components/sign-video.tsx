// =======================================================
// GEBÄRDENVIDEO (DGS) AN DER AUDIOKACHEL
// So kommt ein Video dazu – sonst nichts ändern:
// • Datei nach src/videos/ legen, Name = id des Tracks:
//     nikolaus.mp4, heiligabend.mp4, moment.mp4, pmr.mp4,
//     zeit-fuer-dich.mp4
// • optional daneben: gleicher Name als .vtt (Untertitel)
//   und als .jpg (Standbild vor dem Abspielen)
// • ohne Video erscheint kein Button
// • das Video läuft im Hörmodus (components/listening-mode.tsx),
//   umschaltbar zwischen „Audio“ und „Gebärdensprache“
// • Testdateien mit „-test“ im Namen (z. B. moment-test.mp4)
//   erscheinen nur mit ?vorschau, nie auf der öffentlichen Seite
// =======================================================

import { Button } from "@/components/ui/button";
import { usePreview } from "@/lib/preview";

const files = import.meta.glob("../videos/*.{mp4,vtt,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function fileFor(id: string, ext: string, preview: boolean) {
  return (
    files[`../videos/${id}.${ext}`] ?? (preview ? files[`../videos/${id}-test.${ext}`] : undefined)
  );
}

// Gebärdenzeichen (zwei Hände), aus der Vorlage von Andrea
// (Gebaerdenzeichen_rund.pdf) nachgezeichnet; übernimmt die Textfarbe
export function SignIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="-36 0 744 744" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M318.1 730.4C341.5 726.0 364.7 715.2 408.4 688.2C449.4 663.0 458.9 659.4 534.5 641.5C608.1 624.1 618.5 621.4 625.9 618.0C637.8 612.5 644.0 604.0 644.0 593.2C644.0 578.3 631.8 568.9 614.5 570.4C610.7 570.7 594.2 574.1 578.0 578.0C476.1 602.2 480.3 601.4 476.9 597.1C474.1 593.6 474.6 591.1 478.8 587.1C484.1 582.2 512.8 566.8 591.7 526.9C616.9 514.1 639.8 502.2 642.6 500.4C658.0 490.7 663.9 475.9 657.6 462.5C652.5 451.4 641.5 445.8 629.1 447.8C620.5 449.3 613.3 453.0 538.5 494.5C504.9 513.2 475.0 529.4 472.0 530.7C465.9 533.2 459.4 533.6 456.8 531.6C452.7 528.5 452.8 522.6 457.2 517.1C462.9 509.8 551.5 442.0 592.4 413.5C599.5 408.6 607.2 402.7 609.5 400.5C614.5 395.6 617.9 388.9 618.6 382.4C621.0 362.6 599.6 348.6 580.5 357.4C570.6 361.9 549.4 377.6 473.0 437.0C429.6 470.8 424.8 474.0 418.0 474.0C411.5 474.0 407.7 468.3 409.9 461.7C412.4 454.2 450.7 409.6 501.4 355.2C520.1 335.2 524.8 328.8 527.5 320.3C533.6 301.0 517.5 283.5 497.3 287.8C483.6 290.6 480.1 294.1 411.5 370.0C348.0 440.3 321.8 467.3 303.0 481.4C291.2 490.3 285.8 493.2 282.3 492.8C277.0 492.2 277.1 490.9 284.3 461.6C293.1 426.0 294.9 416.4 295.7 399.9C296.6 378.8 293.0 365.7 283.4 356.5C277.6 350.8 271.8 348.6 264.1 349.2C250.7 350.2 245.8 357.5 241.5 383.0C234.9 421.3 225.8 447.3 203.4 492.1C192.0 515.0 186.4 528.1 181.5 543.0C164.3 596.4 170.4 642.3 199.8 681.5C221.4 710.3 250.6 728.4 281.0 732.0C290.6 733.1 307.7 732.4 318.1 730.4ZM183.2 477.2C200.7 443.9 211.1 413.6 218.0 375.5C220.5 361.4 221.7 357.1 225.1 350.2C233.3 333.3 247.8 324.0 266.1 324.0C289.2 324.0 310.6 342.6 317.7 369.0C320.3 378.4 320.2 412.5 317.7 426.3C316.7 431.7 316.0 436.3 316.2 436.6C316.6 436.9 342.3 409.4 366.9 382.4C376.2 372.1 377.3 370.4 381.5 360.4C392.5 334.3 398.9 324.5 460.0 242.0C482.8 211.3 491.2 198.7 494.0 191.5C503.3 166.6 482.9 147.9 459.8 160.2C448.8 166.1 427.1 191.1 376.6 256.1C364.6 271.6 360.5 274.0 356.0 268.3C354.3 266.2 354.0 264.7 354.4 262.0C354.7 260.1 367.5 233.1 382.9 202.0C418.9 129.2 430.4 104.4 433.6 92.5C439.1 72.3 428.5 55.8 410.0 55.6C401.7 55.5 394.5 59.2 388.7 66.5C384.7 71.6 359.1 122.0 324.9 192.4C313.4 216.1 304.4 233.4 302.7 235.1C296.8 241.0 290.0 237.8 290.0 229.1C290.0 220.8 299.4 191.5 318.2 141.0C329.6 110.5 332.2 103.9 347.0 68.5C357.1 44.6 358.9 37.7 357.0 30.1C354.5 19.5 344.3 12.0 332.5 12.0C320.0 12.0 310.5 19.8 302.5 36.4C292.3 57.8 267.5 124.0 252.8 169.0C237.8 215.0 236.3 218.4 230.6 220.3C228.4 221.0 227.3 220.8 225.1 219.3C222.5 217.3 222.5 217.1 222.6 205.9C222.7 185.5 231.9 100.9 236.5 77.1C237.9 70.2 239.0 61.1 239.0 57.0C239.0 50.2 238.7 48.8 235.8 44.0C231.4 36.7 225.3 33.5 216.0 33.6C196.3 33.8 187.0 50.5 175.1 107.0C166.3 148.8 164.5 167.9 161.1 255.5C160.3 275.2 159.9 279.3 158.1 284.2C152.4 299.2 139.6 300.0 126.8 286.1C121.4 280.3 115.6 271.9 102.7 251.0C80.1 214.4 62.3 199.6 40.5 199.7C31.3 199.7 27.0 201.2 20.9 206.7C16.1 211.0 14.4 214.1 12.9 221.0C10.8 230.9 14.7 240.5 32.0 267.0C61.8 312.8 69.3 327.7 79.6 361.4C82.7 371.4 87.0 384.4 89.2 390.5C102.8 427.1 122.5 452.3 153.5 472.6C161.5 477.8 176.4 486.0 177.9 486.0C178.3 486.0 180.7 482.1 183.2 477.2Z"
      />
    </svg>
  );
}

export type SignVideo = { src: string; poster?: string | undefined; captions?: string | undefined };

export function useSignVideo(id: string): SignVideo | null {
  const preview = usePreview();
  const src = fileFor(id, "mp4", preview);
  if (!src) return null;
  return { src, poster: fileFor(id, "jpg", preview), captions: fileFor(id, "vtt", preview) };
}

export function SignVideoButton({ title, onOpen }: { title: string; onOpen: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="sign-video-button mt-2 min-h-11 w-full rounded-full px-5"
      onClick={onOpen}
      aria-label={`„${title}“ in Gebärdensprache ansehen`}
    >
      <SignIcon className="size-5" />
      In Gebärdensprache
    </Button>
  );
}
