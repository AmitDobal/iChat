import React from "react";

const Toast = () => {
  return (
    <div
      class="max-w-xs bg-white border border-gray-400 rounded-xl shadow-lg dark:bg-sasdky-100 dark:border-neutral-300"
      role="alert">
      <div class="flex p-4">
        <div class="flex-shrink-0">
          <svg
            class="flex-shrink-0 size-4 text-teal-500 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
          </svg>
        </div>
        <div class="ms-3">
          <p class="text-sm text-gray-900 dark:text-neutral-700">
            This is a success message.
          </p>
        </div>
        <div class="ms-auto">
          <button
            type="button"
            class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
            data-hs-remove-element="#dismiss-toast">
            <span class="sr-only">Close</span>
            <svg
              class="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
