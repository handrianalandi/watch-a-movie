"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Image,
} from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import { DEFAULT_MOVIE_PLACEHOLDER } from "@/constant/general";

interface PosterModalProps {
  posterUrl: string;
  title: string;
  onClose: () => void;
}

export default function PosterModal({
  posterUrl,
  title,
  onClose,
}: PosterModalProps) {
  const [source, setSource] = useState(posterUrl);
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="3xl"
      classNames={{
        base: "bg-black/90 backdrop-blur-sm",
        backdrop: "bg-black/90",
        closeButton: "hidden",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <Button
              isIconOnly
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70"
              onPress={onClose}
              aria-label="Close modal"
            >
              <IoClose className="text-2xl text-white" />
            </Button>
            <ModalBody className="p-4">
              <div className="relative max-w-4xl max-h-[90vh] w-full mx-auto">
                <div className="relative w-full">
                  <Image
                    src={source}
                    alt={`${title} poster`}
                    className="object-contain max-h-[80vh] w-full"
                    removeWrapper
                    onError={() => {
                      setSource(DEFAULT_MOVIE_PLACEHOLDER);
                    }}
                  />
                </div>
                <p className="text-center text-white mt-4 text-lg font-semibold">
                  {title}
                </p>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
