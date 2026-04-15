
import TextType from './TextType';

import Logo from './Logo'; 


function LogoText(){

 return (
<header className="flex items-center mt-8 px-8">
  <Logo />
  <div className="flex-1 flex justify-center">
    <TextType 
      text={["Partner with Oro Integrated Cooperativesss"]}
      typingSpeed={75}
      pauseDuration={1500}
      showCursor={true}
      cursorCharacter="|"
    />
  </div>
       </header>  
    
  );

}

export default LogoText;