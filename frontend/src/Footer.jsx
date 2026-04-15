import {Link} from 'react-router-dom'

function Footer(){

return(
<footer class="bg-neutral-primary-soft rounded-base shadow-xs border border-default">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-body sm:text-center">© 2026 <a href="https://flowbite.com/" class="hover:underline">OIC</a>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
        <li>
            <Link to ="/" class="hover:underline me-4 md:me-6">About</Link>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="#" class="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>
);
}
export default Footer