import Image from "next/image";

export default function ErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-4xl">Oops! Something went wrong.</h1>
      <p className="text-center">
        We apologize for the inconvenience. Please try again later.
      </p>
      <Image
        src="/Robot-500.jpg"
        alt="Sad Robot Error 500"
        width={375}
        height={375}
      />
    </div>
  );
}
