import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-black py-4 px-4">
      <div className="flex justify-center">
        <Image
          src="/Logo_Cielocanto_cielocanto-3.png"
          alt="Cielocanto Logo"
          width={200}
          height={67}
          className="object-contain h-auto"
        />
      </div>
    </header>
  );
};

export default Header; 