// Custom vector wordmark for "Riley Byers" — letterform outlines extracted
// from Poppins Bold (SIL Open Font License, free for any use) and rebuilt
// as raw SVG paths, with the "i" dot swapped for an enlarged accent-color
// circle. A from-scratch alternative to licensing a display font, and a
// small callback to the ring-shaped favicon via the dot motif.
export default function NameWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-20 -20 5835 1440"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g transform="translate(0,1050) scale(1,-1)" fill="currentColor">
        <path d="M420 0 274 265H233V0H62V702H349Q432 702 490.5 673.0Q549 644 578.0 593.5Q607 543 607 481Q607 411 567.5 356.0Q528 301 451 278L613 0ZM233 386H339Q386 386 409.5 409.0Q433 432 433 474Q433 514 409.5 537.0Q386 560 339 560H233Z" transform="translate(0,0)" />
        <path d="M233 558V0H62V558Z" transform="translate(672,0)" />
        <path d="M233 740V0H62V740Z" transform="translate(987,0)" />
        <path d="M585 238H198Q202 186 231.5 158.5Q261 131 304 131Q368 131 393 185H575Q561 130 524.5 86.0Q488 42 433.0 17.0Q378 -8 310 -8Q228 -8 164.0 27.0Q100 62 64.0 127.0Q28 192 28 279Q28 366 63.5 431.0Q99 496 163.0 531.0Q227 566 310 566Q391 566 454.0 532.0Q517 498 552.5 435.0Q588 372 588 288Q588 264 585 238ZM413 333Q413 377 383.0 403.0Q353 429 308 429Q265 429 235.5 404.0Q206 379 199 333Z" transform="translate(1302,0)" />
        <path d="M632 558 282 -265H98L226 19L-1 558H190L319 209L447 558Z" transform="translate(1938,0)" />
        <path d="M622 191Q622 103 560.5 51.5Q499 0 389 0H62V702H378Q485 702 545.5 653.0Q606 604 606 520Q606 458 573.5 417.0Q541 376 487 360Q548 347 585.0 299.5Q622 252 622 191ZM233 418H345Q387 418 409.5 436.5Q432 455 432 491Q432 527 409.5 546.0Q387 565 345 565H233ZM449 214Q449 251 424.5 272.0Q400 293 357 293H233V138H359Q402 138 425.5 157.5Q449 177 449 214Z" transform="translate(2822,0)" />
        <path d="M632 558 282 -265H98L226 19L-1 558H190L319 209L447 558Z" transform="translate(3501,0)" />
        <path d="M585 238H198Q202 186 231.5 158.5Q261 131 304 131Q368 131 393 185H575Q561 130 524.5 86.0Q488 42 433.0 17.0Q378 -8 310 -8Q228 -8 164.0 27.0Q100 62 64.0 127.0Q28 192 28 279Q28 366 63.5 431.0Q99 496 163.0 531.0Q227 566 310 566Q391 566 454.0 532.0Q517 498 552.5 435.0Q588 372 588 288Q588 264 585 238ZM413 333Q413 377 383.0 403.0Q353 429 308 429Q265 429 235.5 404.0Q206 379 199 333Z" transform="translate(4153,0)" />
        <path d="M408 564V383H361Q297 383 265.0 355.5Q233 328 233 259V0H62V558H233V465Q263 511 308.0 537.5Q353 564 408 564Z" transform="translate(4789,0)" />
        <path d="M32 183H201Q204 154 228.0 136.0Q252 118 287 118Q319 118 336.5 130.5Q354 143 354 163Q354 187 329.0 198.5Q304 210 248 224Q188 238 148.0 253.5Q108 269 79.0 302.5Q50 336 50 393Q50 441 76.5 480.5Q103 520 154.5 543.0Q206 566 277 566Q382 566 442.5 514.0Q503 462 512 376H354Q350 405 328.5 422.0Q307 439 272 439Q242 439 226.0 427.5Q210 416 210 396Q210 372 235.5 360.0Q261 348 315 336Q377 320 416.0 304.5Q455 289 484.5 254.5Q514 220 515 162Q515 113 487.5 74.5Q460 36 408.5 14.0Q357 -8 289 -8Q216 -8 159.0 17.0Q102 42 69.0 85.5Q36 129 32 183Z" transform="translate(5237,0)" />
      </g>
      {/* Accent dot on the "i", enlarged and recolored — positioned
          directly in top-down SVG coordinates (outside the flipped
          group), equivalent to font-space (819.5, 748). */}
      <circle cx="819.5" cy="302" r="128" fill="#C8FF3D" />
    </svg>
  );
}
