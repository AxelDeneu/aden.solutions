import YamarkLogo from '$lib/imgs/yamark.png';
import ScaniaLogo from '$lib/imgs/scania.webp';
import LaMieCalineLogo from '$lib/imgs/lamiecaline.png';
import GrossetFournier from '$lib/imgs/grossetfournier.png';
import Leclerc from '$lib/imgs/leclerc.png';
import GeneralElectric from '$lib/imgs/ge.png';
import type { Customers } from '$lib/types';

const customers: Customers = {
	label: 'My Customers',
	items: [YamarkLogo, ScaniaLogo, LaMieCalineLogo, GrossetFournier, Leclerc, GeneralElectric]
};

export default customers;
