import BlurText from './TextType';
import Logo from './Logo';
import SignIn from './SignIn';

function Header() {
  return (
    <header className="bg-white">
      <div className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">

        <div className="flex-shrink-0">
          <Logo />
        </div>
        
     
        <div className="flex-1 flex justify-center">
          <BlurText/>
        </div>
        
  
        <div className="flex-shrink-0">
          <SignIn/>
        </div>
      </div>
    </header>
  );
}

export default Header;