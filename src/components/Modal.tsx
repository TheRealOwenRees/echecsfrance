import React, { ComponentProps, Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

type ModalProps = ComponentProps<typeof Dialog> & {
  title?: string;
  subTitle?: string;

  titleClass?: string;
  subTitleClass?: string;
  overlayClass?: string;
  panelClass?: string;
  children?: React.ReactNode;
};

export const Modal = ({
  open,
  onClose,

  title,
  subTitle,

  titleClass,
  subTitleClass,
  overlayClass,
  panelClass,
  children,

  ...dialogProps
}: ModalProps) => (
  <Transition appear show={open} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-[2000]"
      onClose={onClose}
      {...dialogProps}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={twMerge("fixed inset-0 bg-neutral-900/50", overlayClass)}
        />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={twMerge(
                "flex w-full max-w-md transform flex-col space-y-6 overflow-hidden rounded-lg bg-neutral-100 p-4 transition-all dark:bg-neutral-600",
                panelClass,
              )}
            >
              {title && (
                <div>
                  <div className="flex items-center justify-between space-x-4">
                    <Dialog.Title
                      as="h3"
                      className={twMerge(
                        "text-xl font-normal !leading-8 text-black dark:text-white",
                        titleClass,
                      )}
                    >
                      {title}
                    </Dialog.Title>
                  </div>

                  {subTitle && (
                    <Dialog.Description
                      className={twMerge(
                        "mt-2 text-left text-xs font-normal text-black dark:text-white",
                        subTitleClass,
                      )}
                    >
                      {subTitle}
                    </Dialog.Description>
                  )}
                </div>
              )}

              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
