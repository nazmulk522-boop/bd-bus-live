import { BusCompany, BusRoute, RouteCheckpoint } from '../types';

export const BUS_COMPANIES: BusCompany[] = [
  // Major Highway, Inter-District & AC/Non-AC Coaches
  { id: 'hanif', name: 'Hanif Enterprise', nameBn: 'হানিফ এন্টারপ্রাইজ', color: '#E11D48', hotline: '01713-049544' },
  { id: 'hanif-ktc', name: 'Hanif KTC', nameBn: 'হানিফ কেটিসি', color: '#E11D48', hotline: '01713-049545' },
  { id: 'haniya', name: 'Haniya Paribahan', nameBn: 'হানিয়া পরিবহন', color: '#BE123C', hotline: '01711-234567' },
  { id: 'haque-special', name: 'Haque Special', nameBn: 'হক স্পেশাল', color: '#9F1239', hotline: '01712-345678' },
  { id: 'shyamoli', name: 'Shyamoli N.R. Travels', nameBn: 'শ্যামলী এন.আর. ট্রাভেলস', color: '#2563EB', hotline: '01711-131131' },
  { id: 'shyamoli-paribahan', name: 'Shyamoli Paribahan', nameBn: 'শ্যামলী পরিবহন', color: '#1D4ED8', hotline: '01711-131132' },
  { id: 'shyamoli-sp', name: 'Shyamoli SP Paribahan', nameBn: 'শ্যামলী এসপি পরিবহন', color: '#1E40AF', hotline: '01711-131133' },
  { id: 'shothibari-special', name: 'Shothibari Special', nameBn: 'শঠিবাড়ি স্পেশাল', color: '#3B82F6', hotline: '01714-567890' },
  { id: 'shah-fateh-ali', name: 'Shah Fateh Ali', nameBn: 'শাহ ফতেহ আলী', color: '#1E40AF', hotline: '01711-987654' },
  { id: 'shah-ali', name: 'Shah Ali Paribahan', nameBn: 'শাহ আলী পরিবহন', color: '#0284C7', hotline: '01715-678901' },
  { id: 'shah-ali-express', name: 'Shah Ali Express', nameBn: 'শাহ আলী এক্সপ্রেস', color: '#0369A1', hotline: '01715-678902' },
  { id: 'soudia', name: 'Soudia Coach Service', nameBn: 'সৌদিয়া কোচ সার্ভিস', color: '#059669', hotline: '01919-654854' },
  { id: 'saudia-s-alam', name: 'Saudia S Alam', nameBn: 'সৌদিয়া এস আলম', color: '#047857', hotline: '01919-654855' },
  { id: 's-alam', name: 'S Alam Service', nameBn: 'এস আলম সার্ভিসেস', color: '#0F766E', hotline: '01819-382838' },
  { id: 'ena', name: 'Ena Transport', nameBn: 'এনা ট্রান্সপোর্ট', color: '#D97706', hotline: '01869-700700' },
  { id: 'greenline', name: 'Green Line Paribahan', nameBn: 'গ্রীন লাইন পরিবহন', color: '#16A34A', hotline: '01730-060000' },
  { id: 'shohagh', name: 'Shohagh Paribahan', nameBn: 'সোহাগ পরিবহন', color: '#7C3AED', hotline: '01711-542964' },
  { id: 'saintmartin', name: 'Saintmartin Paribahan', nameBn: 'সেন্টমার্টিন পরিবহন', color: '#0891B2', hotline: '01712-404040' },
  { id: 'saintmartin-travels', name: 'Saintmartin Travels', nameBn: 'সেন্টমার্টিন ট্রাভেলস', color: '#06B6D4', hotline: '01712-404041' },
  { id: 'desh', name: 'Desh Travels', nameBn: 'দেশ ট্রাভেলস', color: '#DC2626', hotline: '01762-684400' },
  { id: 'sr', name: 'SR Travels', nameBn: 'এস.আর ট্রাভেলস', color: '#4F46E5', hotline: '01711-370125' },
  { id: 'sr-plus', name: 'SR Plus', nameBn: 'এস.আর প্লাস', color: '#4338CA', hotline: '01711-370126' },
  { id: 'nabil', name: 'Nabil Paribahan', nameBn: 'নাবিল পরিবহন', color: '#9333EA', hotline: '01711-209090' },
  { id: 'akota', name: 'Akota Transport', nameBn: 'একতা ট্রান্সপোর্ট', color: '#EA580C', hotline: '01711-123456' },
  { id: 'royal', name: 'Royal Express', nameBn: 'রয়েল এক্সপ্রেস', color: '#C026D3', hotline: '01711-654321' },
  { id: 'rozina', name: 'Rozina Enterprise', nameBn: 'রোজিনা এন্টারপ্রাইজ', color: '#DB2777', hotline: '01712-765432' },
  { id: 'bablu', name: 'Bablu Enterprise', nameBn: 'বাবলু এন্টারপ্রাইজ', color: '#0D9488', hotline: '01713-876543' },
  { id: 'tungipara', name: 'Tungipara Express', nameBn: 'টুঙ্গিপাড়া এক্সপ্রেস', color: '#059669', hotline: '01714-987654' },
  { id: 'goldenline', name: 'Golden Line', nameBn: 'গোল্ডেন লাইন', color: '#CA8A04', hotline: '01715-098765' },
  { id: 'sp-goldenline', name: 'SP Golden Line', nameBn: 'এসপি গোল্ডেন লাইন', color: '#B45309', hotline: '01715-098766' },
  { id: 'starline', name: 'Star Line Special', nameBn: 'স্টার লাইন স্পেশাল', color: '#2563EB', hotline: '01716-109876' },
  { id: 'sakura', name: 'Sakura Paribahan', nameBn: 'সাকুরা পরিবহন', color: '#E11D48', hotline: '01717-210987' },
  { id: 'manik', name: 'Manik Express', nameBn: 'মানিক এক্সপ্রেস', color: '#475569', hotline: '01718-321098' },
  { id: 'manikganj-subarna', name: 'Manikganj Subarna', nameBn: 'মানিকগঞ্জ সুবর্ণ', color: '#334155', hotline: '01718-321099' },
  { id: 'agomony', name: 'Agomony Express', nameBn: 'আগমনী এক্সপ্রেস', color: '#4338CA', hotline: '01719-432109' },
  { id: 'teesta', name: 'Teesta Paribahan', nameBn: 'তিস্তা পরিবহন', color: '#0891B2', hotline: '01720-543210' },
  { id: 'pabna', name: 'Pabna Express', nameBn: 'পাবনা এক্সপ্রেস', color: '#15803D', hotline: '01721-654321' },
  { id: 'jamuna', name: 'Jamuna Express', nameBn: 'যমুনা এক্সপ্রেস', color: '#0369A1', hotline: '01722-765432' },
  { id: 'jamuna-line', name: 'Jamuna Line', nameBn: 'যমুনা লাইন', color: '#0284C7', hotline: '01722-765433' },
  { id: 'dipjol', name: 'Dipjol Enterprise', nameBn: 'দীপজল এন্টারপ্রাইজ', color: '#B91C1C', hotline: '01723-876543' },
  { id: 'grameen', name: 'Grameen Travels', nameBn: 'গ্রামীণ ট্রাভেলস', color: '#166534', hotline: '01724-987654' },
  { id: 'brtc', name: 'BRTC Bus Service', nameBn: 'বিআরটিসি বাস সার্ভিস', color: '#DC2626', hotline: '16107' },
  { id: 'london-express', name: 'London Express', nameBn: 'লন্ডন এক্সপ্রেস', color: '#9333EA', hotline: '01711-000999' },
  { id: 'silkline', name: 'Silkline Travels', nameBn: 'সিল্কলাইন ট্রাভেলস', color: '#6366F1', hotline: '01711-888777' },
  { id: 'unique', name: 'Unique Service', nameBn: 'ইউনিক সার্ভিস', color: '#0284C7', hotline: '01712-112233' },
  { id: 'eagle', name: 'Eagle Paribahan', nameBn: 'ঈগল পরিবহন', color: '#B45309', hotline: '01713-334455' },
  { id: 'tisha', name: 'Tisha Paribahan', nameBn: 'তিশা পরিবহন', color: '#BE185D', hotline: '01714-445566' },
  { id: 'asia-line', name: 'Asia Line / Asia Aircon', nameBn: 'এশিয়া লাইন / এশিয়া এয়ারকন', color: '#0D9488', hotline: '01715-556677' },
  { id: 'relax', name: 'Relax Transport', nameBn: 'রিলাক্স পরিবহন', color: '#4F46E5', hotline: '01716-667788' },
  { id: 'modern-line', name: 'Modern Line', nameBn: 'মডার্ন লাইন', color: '#059669', hotline: '01717-778899' },
  { id: 'suravi', name: 'Suravi Paribahan', nameBn: 'সুরভী পরিবহন', color: '#EA580C', hotline: '01718-889900' },
  { id: 'rony-express', name: 'Rony Express', nameBn: 'রনি এক্সপ্রেস', color: '#16A34A', hotline: '01719-990011' },
  { id: 'seba-greenline', name: 'Seba Green Line', nameBn: 'সেবা গ্রীন লাইন', color: '#15803D', hotline: '01720-001122' },
  { id: 'ruposhi-bangla', name: 'Ruposhi Bangla', nameBn: 'রূপসী বাংলা', color: '#E11D48', hotline: '01721-112233' },
  { id: 'titas', name: 'Titas Paribahan', nameBn: 'তিতাস পরিবহন', color: '#0284C7', hotline: '01722-223344' },
  { id: 'uttarbanga', name: 'Uttarbanga Paribahan', nameBn: 'উত্তরবঙ্গ পরিবহন', color: '#D97706', hotline: '01723-334455' },
  { id: 'karnaphuli', name: 'Karnaphuli Express', nameBn: 'কর্ণফুলী এক্সপ্রেস', color: '#0F766E', hotline: '01724-445566' },
  { id: 'diganta', name: 'Diganta Paribahan', nameBn: 'দিগন্ত পরিবহন', color: '#7C3AED', hotline: '01725-556677' },
  { id: 'padma-express', name: 'Padma Express', nameBn: 'পদ্মা এক্সপ্রেস', color: '#0891B2', hotline: '01726-667788' },
  { id: 'padma-bridge-special', name: 'Padma Bridge Special', nameBn: 'পদ্মা সেতু স্পেশাল', color: '#2563EB', hotline: '01726-667789' },
  { id: 'ananda', name: 'Ananda Paribahan', nameBn: 'আনন্দ পরিবহন', color: '#CA8A04', hotline: '01727-778899' },
  { id: 'alif-enterprise', name: 'Alif Enterprise', nameBn: 'আলিফ এন্টারপ্রাইজ', color: '#9333EA', hotline: '01728-889900' },
  { id: 'janani', name: 'Janani Paribahan', nameBn: 'জননী পরিবহন', color: '#BE123C', hotline: '01729-990011' },
  { id: 'sohel-express', name: 'Sohel Express', nameBn: 'সোহেল এক্সপ্রেস', color: '#166534', hotline: '01730-001122' },
  { id: 'sk-travels', name: 'SK Travels', nameBn: 'এস কে ট্রাভেলস', color: '#4338CA', hotline: '01731-112233' },
  { id: 'choice', name: 'Choice Paribahan', nameBn: 'চয়েস পরিবহন', color: '#D97706', hotline: '01732-223344' },
  { id: 'sonar-bangla', name: 'Sonar Bangla Paribahan', nameBn: 'সোনার বাংলা পরিবহন', color: '#B45309', hotline: '01733-334455' },
  { id: 'nirapad', name: 'Nirapad Paribahan', nameBn: 'নিরাপদ পরিবহন', color: '#059669', hotline: '01734-445566' },
  { id: 'dolphin', name: 'Dolphin Paribahan', nameBn: 'ডলফিন পরিবহন', color: '#0284C7', hotline: '01735-556677' },
  { id: 'meghna-travels', name: 'Meghna Travels', nameBn: 'মেঘনা ট্রাভেলস', color: '#0891B2', hotline: '01736-667788' },
  { id: 'surma-paribahan', name: 'Surma Paribahan', nameBn: 'সুরমা পরিবহন', color: '#2563EB', hotline: '01737-778899' },
  { id: 'shuvechha', name: 'Shuvechha Paribahan', nameBn: 'শুভেচ্ছা পরিবহন', color: '#16A34A', hotline: '01738-889900' },
  { id: 'satata-express', name: 'Satata Express', nameBn: 'সততা এক্সপ্রেস', color: '#EA580C', hotline: '01739-990011' },
  { id: 'al-mobaraka', name: 'Al-Mobaraka Paribahan', nameBn: 'আল-মোবারাকা পরিবহন', color: '#15803D', hotline: '01740-001122' },
  { id: 'al-rafi', name: 'Al-Rafi Enterprise', nameBn: 'আল-রাফি এন্টারপ্রাইজ', color: '#0D9488', hotline: '01741-112233' },
  { id: 'falguni', name: 'Falguni Paribahan', nameBn: 'ফাল্গুনী পরিবহন', color: '#DB2777', hotline: '01742-223344' },
  { id: 'shimanto', name: 'Shimanto Paribahan', nameBn: 'সীমান্ত পরিবহন', color: '#475569', hotline: '01743-334455' },
  { id: 'chandana', name: 'Chandana Paribahan', nameBn: 'চন্দনা পরিবহন', color: '#7C3AED', hotline: '01744-445566' },
  { id: 'dhaka-express', name: 'Dhaka Express', nameBn: 'ঢাকা এক্সপ্রেস', color: '#DC2626', hotline: '01745-556677' },
  { id: 'barendra-express', name: 'Barendra Express', nameBn: 'বরেন্দ্র এক্সপ্রেস', color: '#CA8A04', hotline: '01746-667788' },
  { id: 'rupsha', name: 'Rupsha Paribahan', nameBn: 'রূপসা পরিবহন', color: '#0284C7', hotline: '01747-778899' },
  { id: 'sundarban-express', name: 'Sundarban Express', nameBn: 'সুন্দরবন এক্সপ্রেস', color: '#166534', hotline: '01748-889900' },
  { id: 'madhumati', name: 'Madhumati Paribahan', nameBn: 'মধুমতি পরিবহন', color: '#B91C1C', hotline: '01749-990011' },
  { id: 'korotoa-express', name: 'Korotoa Express', nameBn: 'করতোয়া এক্সপ্রেস', color: '#1D4ED8', hotline: '01750-001122' },
  { id: 'dreamland', name: 'Dreamland Paribahan', nameBn: 'ড্রিমল্যান্ড পরিবহন', color: '#9333EA', hotline: '01751-112233' },
  { id: 'kuyasha', name: 'Kuyasha Paribahan', nameBn: 'কুয়াশা পরিবহন', color: '#6366F1', hotline: '01752-223344' },
  { id: 'ilish', name: 'Ilish Paribahan', nameBn: 'ইলিশ পরিবহন', color: '#0891B2', hotline: '01753-334455' },
  { id: 'saikat', name: 'Saikat Paribahan', nameBn: 'সৈকত পরিবহন', color: '#059669', hotline: '01754-445566' },
  { id: 'sonali', name: 'Sonali Paribahan', nameBn: 'সোনালী পরিবহন', color: '#CA8A04', hotline: '01755-556677' },
  { id: 'keya', name: 'Keya Paribahan', nameBn: 'কেয়া পরিবহন', color: '#BE185D', hotline: '01756-667788' },
  { id: 'sheba-transport', name: 'Sheba Transport', nameBn: 'সেবা ট্রান্সপোর্ট', color: '#0F766E', hotline: '01757-778899' },
  { id: 'dipon', name: 'Dipon Paribahan', nameBn: 'দিপন পরিবহন', color: '#EA580C', hotline: '01758-889900' },
  { id: 'nilachol', name: 'Nilachol Paribahan', nameBn: 'নীলাচল পরিবহন', color: '#2563EB', hotline: '01759-990011' },
  { id: 'purabi', name: 'Purabi Paribahan', nameBn: 'পূরবী পরিবহন', color: '#4338CA', hotline: '01760-001122' },
  { id: 'labiba-classic', name: 'Labiba Classic', nameBn: 'লাবিবা ক্লাসিক', color: '#15803D', hotline: '01761-112233' },
  { id: 'subarna', name: 'Subarna Paribahan', nameBn: 'সুবর্ণ পরিবহন', color: '#B45309', hotline: '01762-223344' },
  { id: 'purbasha', name: 'Purbasha Paribahan', nameBn: 'পূর্বাশা পরিবহন', color: '#DC2626', hotline: '01763-334455' },
  { id: 'alhamra', name: 'Alhamra Paribahan', nameBn: 'আলহামরা পরিবহন', color: '#7C3AED', hotline: '01764-445566' },
  { id: 'shahzadpur-travels', name: 'Shahzadpur Travels', nameBn: 'শাহজাদপুর ট্রাভেলস', color: '#0891B2', hotline: '01765-556677' },
  { id: 'bismillah', name: 'Bismillah Paribahan', nameBn: 'বিসমিল্লাহ পরিবহন', color: '#16A34A', hotline: '01766-667788' },
  { id: 'raida', name: 'Raida Enterprise', nameBn: 'রাইদা এন্টারপ্রাইজ', color: '#E11D48', hotline: '01767-778899' },

  // Dhaka City & Suburban Local Bus Services
  { id: 'bikash', name: 'Bikash Paribahan', nameBn: 'বিকাশ পরিবহন', color: '#DB2777', hotline: '01770-001122' },
  { id: 'rajdhani', name: 'Rajdhani Paribahan', nameBn: 'রাজধানী পরিবহন', color: '#DC2626', hotline: '01771-112233' },
  { id: 'boishakhi', name: 'Boishakhi Paribahan', nameBn: 'বৈশাখী পরিবহন', color: '#EA580C', hotline: '01772-223344' },
  { id: 'shikor', name: 'Shikor Paribahan', nameBn: 'শিকড় পরিবহন', color: '#16A34A', hotline: '01773-334455' },
  { id: 'projapoti', name: 'Projapoti Paribahan', nameBn: 'প্রজাপতি পরিবহন', color: '#9333EA', hotline: '01774-445566' },
  { id: 'achim', name: 'Achim Paribahan', nameBn: 'অছিম পরিবহন', color: '#2563EB', hotline: '01775-556677' },
  { id: 'balaka', name: 'Balaka Paribahan', nameBn: 'বলাকা পরিবহন', color: '#0284C7', hotline: '01776-667788' },
  { id: 'midway', name: 'Midway Paribahan', nameBn: 'মিডওয়ে পরিবহন', color: '#CA8A04', hotline: '01777-778899' },
  { id: 'bihanga', name: 'Bihanga Paribahan', nameBn: 'বিহঙ্গ পরিবহন', color: '#059669', hotline: '01778-889900' },
  { id: 'vip-autos', name: 'VIP Autos', nameBn: 'ভিআইপি অটোস', color: '#4F46E5', hotline: '01779-990011' },
  { id: 'trust-transport', name: 'Trust Transport Services', nameBn: 'ট্রাস্ট ট্রান্সপোর্ট', color: '#15803D', hotline: '01780-001122' },
  { id: 'turag', name: 'Turag Paribahan', nameBn: 'তুরাগ পরিবহন', color: '#0891B2', hotline: '01781-112233' },
  { id: 'anabil', name: 'Anabil Paribahan', nameBn: 'অনাবিল পরিবহন', color: '#BE123C', hotline: '01782-223344' },
  { id: 'robrob', name: 'Robrob Paribahan', nameBn: 'রব রব পরিবহন', color: '#4338CA', hotline: '01783-334455' },
  { id: 'tanjil', name: 'Tanjil Paribahan', nameBn: 'তাঞ্জিল পরিবহন', color: '#D97706', hotline: '01784-445566' },
  { id: 'savar-paribahan', name: 'Savar Paribahan', nameBn: 'সাভার পরিবহন', color: '#475569', hotline: '01785-556677' },
  { id: 'transilva', name: 'Transilva Paribahan', nameBn: 'ট্রানসিলভা পরিবহন', color: '#7C3AED', hotline: '01786-667788' },
  { id: 'winner', name: 'Winner Transport', nameBn: 'উইনার ট্রান্সপোর্ট', color: '#0D9488', hotline: '01787-778899' },
  { id: 'swadhin', name: 'Swadhin Paribahan', nameBn: 'স্বাধীন পরিবহন', color: '#166534', hotline: '01788-889900' },
  { id: 'manzil-express', name: 'Manzil Express', nameBn: 'মঞ্জিল এক্সপ্রেস', color: '#B45309', hotline: '01789-990011' },
  { id: 'raja-city', name: 'Raja City Paribahan', nameBn: 'রাজা সিটি পরিবহন', color: '#1E40AF', hotline: '01790-001122' },
  { id: 'green-dhaka', name: 'Green Dhaka Paribahan', nameBn: 'গ্রীন ঢাকা পরিবহন', color: '#15803D', hotline: '01791-112233' },
  { id: 'basumati', name: 'Basumati Transport', nameBn: 'বসুমতী ট্রান্সপোর্ট', color: '#CA8A04', hotline: '01792-223344' },
  { id: 'labbaik', name: 'Labbaik Transport', nameBn: 'লাব্বাইক ট্রান্সপোর্ট', color: '#059669', hotline: '01793-334455' },
  { id: 'suprovat', name: 'Suprovat Paribahan', nameBn: 'সুপ্রভাত পরিবহন', color: '#DC2626', hotline: '01794-445566' },
  { id: 'gazipur-paribahan', name: 'Gazipur Paribahan', nameBn: 'গাজীপুর পরিবহন', color: '#2563EB', hotline: '01795-556677' },
  { id: 'ayub-paribahan', name: 'Ayub Paribahan', nameBn: 'আইয়ুব পরিবহন', color: '#0891B2', hotline: '01796-667788' },
  { id: 'dishari', name: 'Dishari Paribahan', nameBn: 'দিশারী পরিবহন', color: '#7C3AED', hotline: '01797-778899' },
  { id: 'victor-classic', name: 'Victor Classic', nameBn: 'ভিক্টর ক্লাসিক', color: '#B91C1C', hotline: '01798-889900' },
  { id: 'dewan', name: 'Dewan Enterprise', nameBn: 'দেওয়ান এন্টারপ্রাইজ', color: '#4F46E5', hotline: '01799-990011' },
  { id: 'tetulia', name: 'Tetulia Paribahan', nameBn: 'তেঁতুলিয়া পরিবহন', color: '#0F766E', hotline: '01710-123789' },
  { id: 'azmir', name: 'Azmir Paribahan', nameBn: 'আজমির পরিবহন', color: '#EA580C', hotline: '01710-987123' }
];

export const BUS_ROUTES: BusRoute[] = [
  {
    id: 'dhaka-sirajganj',
    name: 'Dhaka - Sirajganj',
    nameBn: 'ঢাকা → সিরাজগঞ্জ',
    origin: 'Dhaka (Gabtoli)',
    originBn: 'ঢাকা (গাবতলী)',
    destination: 'Sirajganj',
    destinationBn: 'সিরাজগঞ্জ',
    highwayCode: 'N5',
    totalDistanceKm: 138,
    estimatedMinutes: 210,
    checkpoints: [
      { id: 'gabtoli', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'savar', name: 'Savar Bus Stand', nameBn: 'সাভার বাস স্ট্যান্ড', lat: 23.8442, lng: 90.2582, sequence: 2, distanceKmFromOrigin: 16 },
      { id: 'nabinagar', name: 'Nabinagar Smriti Soudha', nameBn: 'নবীনগর স্মৃতিসৌধ', lat: 23.9056, lng: 90.2631, sequence: 3, distanceKmFromOrigin: 25 },
      { id: 'chandra', name: 'Chandra Trimor', nameBn: 'চন্দ্রা ত্রিমোড়', lat: 24.0381, lng: 90.2442, sequence: 4, distanceKmFromOrigin: 42 },
      { id: 'mirzapur', name: 'Mirzapur Bypass', nameBn: 'মির্জাপুর বাইপাস', lat: 24.1026, lng: 90.1000, sequence: 5, distanceKmFromOrigin: 62 },
      { id: 'tangail', name: 'Tangail Bypass (Elenga)', nameBn: 'টাঙ্গাইল বাইপাস (এলেঙ্গা)', lat: 24.3364, lng: 89.9234, sequence: 6, distanceKmFromOrigin: 92 },
      { id: 'bridge_east', name: 'Bangabandhu Bridge East', nameBn: 'বঙ্গবন্ধু সেতু পূর্ব', lat: 24.3986, lng: 89.7892, sequence: 7, distanceKmFromOrigin: 110 },
      { id: 'kadda', name: 'Kadda Golchattor', nameBn: 'কড্ডা গোলচত্বর', lat: 24.4170, lng: 89.7225, sequence: 8, distanceKmFromOrigin: 125 },
      { id: 'sirajganj', name: 'Sirajganj Central Counter', nameBn: 'সিরাজগঞ্জ সেন্ট্রাল কাউন্টার', lat: 24.4534, lng: 89.7000, sequence: 9, distanceKmFromOrigin: 138 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [23.8150, 90.3120],
      [23.8442, 90.2582],
      [23.9056, 90.2631],
      [23.9720, 90.2580],
      [24.0381, 90.2442],
      [24.0720, 90.1700],
      [24.1026, 90.1000],
      [24.2300, 89.9700],
      [24.3364, 89.9234],
      [24.3986, 89.7892],
      [24.4170, 89.7225],
      [24.4534, 89.7000]
    ]
  },
  {
    id: 'dhaka-chattogram',
    name: 'Dhaka - Chattogram',
    nameBn: 'ঢাকা → চট্টগ্রাম',
    origin: 'Dhaka (Sayedabad)',
    originBn: 'ঢাকা (সায়েদাবাদ)',
    destination: 'Chattogram',
    destinationBn: 'চট্টগ্রাম',
    highwayCode: 'N1',
    totalDistanceKm: 246,
    estimatedMinutes: 300,
    checkpoints: [
      { id: 'sayedabad', name: 'Sayedabad Terminal', nameBn: 'সায়েদাবাদ টার্মিনাল', lat: 23.7145, lng: 90.4285, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'kanchpur', name: 'Kanchpur Bridge', nameBn: 'কাঁচপুর ব্রিজ', lat: 23.6936, lng: 90.5186, sequence: 2, distanceKmFromOrigin: 14 },
      { id: 'meghna', name: 'Meghna Toll Plaza', nameBn: 'মেঘনা টোল প্লাজা', lat: 23.6062, lng: 90.6121, sequence: 3, distanceKmFromOrigin: 28 },
      { id: 'daudkandi', name: 'Daudkandi Bridge', nameBn: 'দাউদকান্দি ব্রিজ', lat: 23.5333, lng: 90.7167, sequence: 4, distanceKmFromOrigin: 45 },
      { id: 'comilla', name: 'Comilla Paduar Bazar', nameBn: 'কুমিল্লা পদুয়ার বাজার', lat: 23.4243, lng: 91.1718, sequence: 5, distanceKmFromOrigin: 98 },
      { id: 'chauddagram', name: 'Chauddagram Bypass', nameBn: 'চৌদ্দগ্রাম বাইপাস', lat: 23.2185, lng: 91.3150, sequence: 6, distanceKmFromOrigin: 130 },
      { id: 'feni', name: 'Feni Mahipal Overpass', nameBn: 'ফেনী মহিপাল ওভারপাস', lat: 23.0159, lng: 91.3976, sequence: 7, distanceKmFromOrigin: 155 },
      { id: 'mirsharai', name: 'Mirsharai Counter', nameBn: 'মীরসরাই কাউন্টার', lat: 22.7711, lng: 91.5753, sequence: 8, distanceKmFromOrigin: 190 },
      { id: 'sitakunda', name: 'Sitakunda Bypass', nameBn: 'সীতাকুণ্ড বাইপাস', lat: 22.6178, lng: 91.6606, sequence: 9, distanceKmFromOrigin: 215 },
      { id: 'alangkar', name: 'Chattogram Alangkar / Dampara', nameBn: 'চট্টগ্রাম অলংকার / দামপাড়া', lat: 22.3569, lng: 91.7832, sequence: 10, distanceKmFromOrigin: 246 }
    ],
    pathCoordinates: [
      [23.7145, 90.4285],
      [23.6936, 90.5186],
      [23.6062, 90.6121],
      [23.5333, 90.7167],
      [23.4750, 90.9600],
      [23.4243, 91.1718],
      [23.2185, 91.3150],
      [23.0159, 91.3976],
      [22.7711, 91.5753],
      [22.6178, 91.6606],
      [22.4500, 91.7400],
      [22.3569, 91.7832]
    ]
  },
  {
    id: 'dhaka-coxsbazar',
    name: 'Dhaka - Cox\'s Bazar',
    nameBn: 'ঢাকা → কক্সবাজার',
    origin: 'Dhaka',
    originBn: 'ঢাকা (সায়েদাবাদ/ফকিরাপুল)',
    destination: 'Cox\'s Bazar',
    destinationBn: 'কক্সবাজার (কলাতলী)',
    highwayCode: 'N1',
    totalDistanceKm: 395,
    estimatedMinutes: 510,
    checkpoints: [
      { id: 'dhaka_cxb', name: 'Dhaka Sayedabad', nameBn: 'ঢাকা সায়েদাবাদ', lat: 23.7145, lng: 90.4285, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'comilla_cxb', name: 'Comilla Paduar Bazar', nameBn: 'কুমিল্লা পদুয়ার বাজার', lat: 23.4243, lng: 91.1718, sequence: 2, distanceKmFromOrigin: 98 },
      { id: 'feni_cxb', name: 'Feni Mahipal', nameBn: 'ফেনী মহিপাল', lat: 23.0159, lng: 91.3976, sequence: 3, distanceKmFromOrigin: 155 },
      { id: 'ctg_cxb', name: 'Chattogram Karnaphuli Bridge', nameBn: 'চট্টগ্রাম কর্ণফুলী সেতু', lat: 22.3167, lng: 91.8480, sequence: 4, distanceKmFromOrigin: 250 },
      { id: 'chakaria_cxb', name: 'Chakaria Bypass', nameBn: 'চকরিয়া বাইপাস', lat: 21.7866, lng: 92.0782, sequence: 5, distanceKmFromOrigin: 325 },
      { id: 'ramu_cxb', name: 'Ramu Bypass', nameBn: 'রামু বাইপাস', lat: 21.4600, lng: 92.1000, sequence: 6, distanceKmFromOrigin: 375 },
      { id: 'coxsbazar_cxb', name: 'Cox\'s Bazar Kolatoli', nameBn: 'কক্সবাজার কলাতলী', lat: 21.4272, lng: 91.9790, sequence: 7, distanceKmFromOrigin: 395 }
    ],
    pathCoordinates: [
      [23.7145, 90.4285],
      [23.4243, 91.1718],
      [23.0159, 91.3976],
      [22.3569, 91.7832],
      [22.3167, 91.8480],
      [21.7866, 92.0782],
      [21.4600, 92.1000],
      [21.4272, 91.9790]
    ]
  },
  {
    id: 'dhaka-sylhet',
    name: 'Dhaka - Sylhet',
    nameBn: 'ঢাকা → সিলেট',
    origin: 'Dhaka',
    originBn: 'ঢাকা (সায়েদাবাদ/মহাখালী)',
    destination: 'Sylhet',
    destinationBn: 'সিলেট (কদমতলী)',
    highwayCode: 'N2',
    totalDistanceKm: 240,
    estimatedMinutes: 330,
    checkpoints: [
      { id: 'dhaka_syl', name: 'Sayedabad Terminal', nameBn: 'সায়েদাবাদ টার্মিনাল', lat: 23.7145, lng: 90.4285, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'narsingdi_syl', name: 'Narsingdi Velanagar', nameBn: 'নরসিংদী ভেলানগর', lat: 23.9193, lng: 90.7176, sequence: 2, distanceKmFromOrigin: 50 },
      { id: 'bhairab_syl', name: 'Bhairab Bridge', nameBn: 'ভৈরব মেঘনা ব্রিজ', lat: 24.0500, lng: 90.9833, sequence: 3, distanceKmFromOrigin: 85 },
      { id: 'sarail_syl', name: 'Sarail Biswa Road', nameBn: 'সরাইল বিশ্বরোড মোড়', lat: 24.1167, lng: 91.1333, sequence: 4, distanceKmFromOrigin: 105 },
      { id: 'madhabpur_syl', name: 'Madhabpur Counter', nameBn: 'মাধবপুর কাউন্টার', lat: 24.1667, lng: 91.3000, sequence: 5, distanceKmFromOrigin: 130 },
      { id: 'shayestaganj_syl', name: 'Shayestaganj Highway', nameBn: 'শায়েস্তাগঞ্জ হাইওয়ে', lat: 24.2833, lng: 91.4333, sequence: 6, distanceKmFromOrigin: 155 },
      { id: 'sherpur_syl', name: 'Sherpur Toll Plaza', nameBn: 'শেরপুর টোল প্লাজা', lat: 24.6167, lng: 91.6833, sequence: 7, distanceKmFromOrigin: 200 },
      { id: 'sylhet_syl', name: 'Sylhet Kadomtoli', nameBn: 'সিলেট কদমতলী টার্মিনাল', lat: 24.8864, lng: 91.8697, sequence: 8, distanceKmFromOrigin: 240 }
    ],
    pathCoordinates: [
      [23.7145, 90.4285],
      [23.9193, 90.7176],
      [24.0500, 90.9833],
      [24.1167, 91.1333],
      [24.1667, 91.3000],
      [24.2833, 91.4333],
      [24.6167, 91.6833],
      [24.8864, 91.8697]
    ]
  },
  {
    id: 'dhaka-rajshahi',
    name: 'Dhaka - Rajshahi',
    nameBn: 'ঢাকা → রাজশাহী',
    origin: 'Dhaka (Gabtoli)',
    originBn: 'ঢাকা (গাবতলী/কল্যাণপুর)',
    destination: 'Rajshahi',
    destinationBn: 'রাজশাহী (রেলগেট/শিরোইল)',
    highwayCode: 'N5 / N6',
    totalDistanceKm: 255,
    estimatedMinutes: 340,
    checkpoints: [
      { id: 'gabtoli_raj', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'tangail_raj', name: 'Tangail Elenga', nameBn: 'টাঙ্গাইল এলেঙ্গা', lat: 24.3364, lng: 89.9234, sequence: 2, distanceKmFromOrigin: 92 },
      { id: 'bridge_raj', name: 'Jamuna Bridge West', nameBn: 'যমুনা সেতু পশ্চিম গোলচত্বর', lat: 24.4170, lng: 89.7225, sequence: 3, distanceKmFromOrigin: 125 },
      { id: 'ullapara_raj', name: 'Ullapara Bypass', nameBn: 'উল্লাপাড়া বাইপাস', lat: 24.3182, lng: 89.5684, sequence: 4, distanceKmFromOrigin: 152 },
      { id: 'bonpara_raj', name: 'Bonpara Bypass', nameBn: 'বনপাড়া বাইপাস', lat: 24.2870, lng: 89.0734, sequence: 5, distanceKmFromOrigin: 195 },
      { id: 'natore_raj', name: 'Natore Madrasha Mor', nameBn: 'নাটোর মাদ্রাসা মোড়', lat: 24.4102, lng: 88.9790, sequence: 6, distanceKmFromOrigin: 215 },
      { id: 'baneshwar_raj', name: 'Baneshwar Bazar', nameBn: 'বানেশ্বর বাজার', lat: 24.3800, lng: 88.7500, sequence: 7, distanceKmFromOrigin: 235 },
      { id: 'rajshahi_raj', name: 'Rajshahi Shiroil Terminal', nameBn: 'রাজশাহী শিরোইল টার্মিনাল', lat: 24.3745, lng: 88.6042, sequence: 8, distanceKmFromOrigin: 255 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [24.0381, 90.2442],
      [24.3364, 89.9234],
      [24.4170, 89.7225],
      [24.3182, 89.5684],
      [24.2870, 89.0734],
      [24.4102, 88.9790],
      [24.3800, 88.7500],
      [24.3745, 88.6042]
    ]
  },
  {
    id: 'dhaka-khulna',
    name: 'Dhaka - Khulna (Padma Bridge)',
    nameBn: 'ঢাকা → খুলনা (পদ্মা সেতু)',
    origin: 'Dhaka (Jatrabari/Sayedabad)',
    originBn: 'ঢাকা (যাত্রাবাড়ী)',
    destination: 'Khulna',
    destinationBn: 'খুলনা (রয়্যাল মোড়)',
    highwayCode: 'N8',
    totalDistanceKm: 180,
    estimatedMinutes: 240,
    checkpoints: [
      { id: 'jatrabari_khu', name: 'Jatrabari Flyover', nameBn: 'যাত্রাবাড়ী মোড়', lat: 23.7073, lng: 90.4357, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'mawa_khu', name: 'Padma Bridge North (Mawa)', nameBn: 'পদ্মা সেতু মাওয়া প্রান্ত', lat: 23.4764, lng: 90.2608, sequence: 2, distanceKmFromOrigin: 38 },
      { id: 'janjira_khu', name: 'Padma Bridge South (Janjira)', nameBn: 'পদ্মা সেতু জাজিরা প্রান্ত', lat: 23.4150, lng: 90.2100, sequence: 3, distanceKmFromOrigin: 46 },
      { id: 'bhanga_khu', name: 'Bhanga Junction', nameBn: 'ভাঙ্গা হাইওয়ে জংশন', lat: 23.3831, lng: 89.9882, sequence: 4, distanceKmFromOrigin: 68 },
      { id: 'gopalganj_khu', name: 'Gopalganj Police Line Mor', nameBn: 'গোপালগঞ্জ পুলিশ লাইন মোড়', lat: 23.0051, lng: 89.8266, sequence: 5, distanceKmFromOrigin: 110 },
      { id: 'bagerhat_khu', name: 'Bagerhat Katakhali', nameBn: 'বাগেরহাট কাটাখালী মোড়', lat: 22.7500, lng: 89.6800, sequence: 6, distanceKmFromOrigin: 150 },
      { id: 'khulna_khu', name: 'Khulna Royal Mor Counter', nameBn: 'খুলনা রয়্যাল মোড় কাউন্টার', lat: 22.8157, lng: 89.5539, sequence: 7, distanceKmFromOrigin: 180 }
    ],
    pathCoordinates: [
      [23.7073, 90.4357],
      [23.4764, 90.2608],
      [23.4150, 90.2100],
      [23.3831, 89.9882],
      [23.0051, 89.8266],
      [22.7500, 89.6800],
      [22.8157, 89.5539]
    ]
  },
  {
    id: 'dhaka-rangpur',
    name: 'Dhaka - Rangpur / Kurigram',
    nameBn: 'ঢাকা → রংপুর / কুড়িগ্রাম',
    origin: 'Dhaka (Gabtoli)',
    originBn: 'ঢাকা (গাবতলী)',
    destination: 'Rangpur',
    destinationBn: 'রংপুর (মডার্ন মোড়)',
    highwayCode: 'N5',
    totalDistanceKm: 305,
    estimatedMinutes: 390,
    checkpoints: [
      { id: 'gabtoli_rng', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'tangail_rng', name: 'Tangail Elenga', nameBn: 'টাঙ্গাইল এলেঙ্গা', lat: 24.3364, lng: 89.9234, sequence: 2, distanceKmFromOrigin: 92 },
      { id: 'bridge_rng', name: 'Jamuna Bridge West', nameBn: 'যমুনা সেতু পশ্চিম গোলচত্বর', lat: 24.4170, lng: 89.7225, sequence: 3, distanceKmFromOrigin: 125 },
      { id: 'bogura_rng', name: 'Bogura Charmatha', nameBn: 'বগুড়া চারমাথা', lat: 24.8510, lng: 89.3697, sequence: 4, distanceKmFromOrigin: 195 },
      { id: 'gobindaganj_rng', name: 'Gobindaganj Bypass', nameBn: 'গোবিন্দগঞ্জ বাইপাস', lat: 25.1320, lng: 89.3470, sequence: 5, distanceKmFromOrigin: 230 },
      { id: 'palashbari_rng', name: 'Palashbari Mor', nameBn: 'পলাশবাড়ী মোড়', lat: 25.2830, lng: 89.3500, sequence: 6, distanceKmFromOrigin: 250 },
      { id: 'shothibari_rng', name: 'Shothibari Bus Stand', nameBn: 'শঠিবাড়ি বাস স্ট্যান্ড', lat: 25.4600, lng: 89.3100, sequence: 7, distanceKmFromOrigin: 275 },
      { id: 'rangpur_rng', name: 'Rangpur Modern Mor', nameBn: 'রংপুর মডার্ন মোড়', lat: 25.7439, lng: 89.2752, sequence: 8, distanceKmFromOrigin: 305 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [24.3364, 89.9234],
      [24.4170, 89.7225],
      [24.8510, 89.3697],
      [25.1320, 89.3470],
      [25.4600, 89.3100],
      [25.7439, 89.2752]
    ]
  },
  {
    id: 'dhaka-barishal',
    name: 'Dhaka - Barishal (Padma Bridge)',
    nameBn: 'ঢাকা → বরিশাল (পদ্মা সেতু)',
    origin: 'Dhaka (Sayedabad)',
    originBn: 'ঢাকা (সায়েদাবাদ/যাত্রাবাড়ী)',
    destination: 'Barishal',
    destinationBn: 'বরিশাল (নথুল্লাবাদ)',
    highwayCode: 'N8',
    totalDistanceKm: 185,
    estimatedMinutes: 210,
    checkpoints: [
      { id: 'sayedabad_bar', name: 'Sayedabad Terminal', nameBn: 'সায়েদাবাদ টার্মিনাল', lat: 23.7145, lng: 90.4285, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'mawa_bar', name: 'Padma Bridge North (Mawa)', nameBn: 'পদ্মা সেতু মাওয়া', lat: 23.4764, lng: 90.2608, sequence: 2, distanceKmFromOrigin: 38 },
      { id: 'bhanga_bar', name: 'Bhanga Interchange', nameBn: 'ভাঙ্গা ইন্টারচেঞ্জ', lat: 23.3831, lng: 89.9882, sequence: 3, distanceKmFromOrigin: 68 },
      { id: 'madaripur_bar', name: 'Mustafapur Madaripur', nameBn: 'মোস্তফাপুর মাদারীপুর', lat: 23.1600, lng: 90.1800, sequence: 4, distanceKmFromOrigin: 110 },
      { id: 'gournadi_bar', name: 'Gournadi Bus Stand', nameBn: 'গৌরনদী বাস স্ট্যান্ড', lat: 22.9700, lng: 90.2200, sequence: 5, distanceKmFromOrigin: 145 },
      { id: 'barishal_bar', name: 'Barishal Nathullabad Terminal', nameBn: 'বরিশাল নথুল্লাবাদ টার্মিনাল', lat: 22.7010, lng: 90.3535, sequence: 6, distanceKmFromOrigin: 185 }
    ],
    pathCoordinates: [
      [23.7145, 90.4285],
      [23.4764, 90.2608],
      [23.3831, 89.9882],
      [23.1600, 90.1800],
      [22.9700, 90.2200],
      [22.7010, 90.3535]
    ]
  },
  {
    id: 'dhaka-mymensingh',
    name: 'Dhaka - Mymensingh',
    nameBn: 'ঢাকা → ময়মনসিংহ',
    origin: 'Dhaka (Mohakhali)',
    originBn: 'ঢাকা (মহাখালী)',
    destination: 'Mymensingh',
    destinationBn: 'ময়মনসিংহ (মাসকান্দা)',
    highwayCode: 'N3',
    totalDistanceKm: 120,
    estimatedMinutes: 160,
    checkpoints: [
      { id: 'mohakhali_mym', name: 'Mohakhali Terminal', nameBn: 'মহাখালী টার্মিনাল', lat: 23.7776, lng: 90.4005, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'gazipur_mym', name: 'Gazipur Chourasta', nameBn: 'গাজীপুর চৌরাস্তা', lat: 23.9989, lng: 90.3800, sequence: 2, distanceKmFromOrigin: 30 },
      { id: 'mawona_mym', name: 'Mawona Chowrasta', nameBn: 'মাওনা চৌরাস্তা', lat: 24.1500, lng: 90.4000, sequence: 3, distanceKmFromOrigin: 58 },
      { id: 'valuka_mym', name: 'Bhaluka Bus Stand', nameBn: 'ভালুকা বাস স্ট্যান্ড', lat: 24.2300, lng: 90.3800, sequence: 4, distanceKmFromOrigin: 75 },
      { id: 'trishal_mym', name: 'Trishal Bazar', nameBn: 'ত্রিশাল বাজার', lat: 24.5800, lng: 90.4000, sequence: 5, distanceKmFromOrigin: 98 },
      { id: 'mymensingh_mym', name: 'Mymensingh Maskanda Terminal', nameBn: 'ময়মনসিংহ মাসকান্দা টার্মিনাল', lat: 24.7471, lng: 90.4203, sequence: 6, distanceKmFromOrigin: 120 }
    ],
    pathCoordinates: [
      [23.7776, 90.4005],
      [23.9989, 90.3800],
      [24.1500, 90.4000],
      [24.2300, 90.3800],
      [24.5800, 90.4000],
      [24.7471, 90.4203]
    ]
  },
  {
    id: 'dhaka-kushtia',
    name: 'Dhaka - Kushtia',
    nameBn: 'ঢাকা → কুষ্টিয়া',
    origin: 'Dhaka (Gabtoli)',
    originBn: 'ঢাকা (গাবতলী)',
    destination: 'Kushtia',
    destinationBn: 'কুষ্টিয়া (মজুপুর)',
    highwayCode: 'N704',
    totalDistanceKm: 195,
    estimatedMinutes: 270,
    checkpoints: [
      { id: 'gabtoli_kus', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'manikganj_kus', name: 'Manikganj Bus Stand', nameBn: 'মানিকগঞ্জ বাস স্ট্যান্ড', lat: 23.8600, lng: 90.0000, sequence: 2, distanceKmFromOrigin: 55 },
      { id: 'paturia_kus', name: 'Paturia Ghat', nameBn: 'পাটুরিয়া ঘাট', lat: 23.8900, lng: 89.7500, sequence: 3, distanceKmFromOrigin: 80 },
      { id: 'rajbari_kus', name: 'Rajbari Mor', nameBn: 'রাজবাড়ী মোড়', lat: 23.7500, lng: 89.6500, sequence: 4, distanceKmFromOrigin: 130 },
      { id: 'kushtia_kus', name: 'Kushtia Mojumpur Gate', nameBn: 'কুষ্টিয়া মজমপুর গেট', lat: 23.9010, lng: 89.1200, sequence: 5, distanceKmFromOrigin: 195 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [23.8600, 90.0000],
      [23.8900, 89.7500],
      [23.7500, 89.6500],
      [23.9010, 89.1200]
    ]
  },
  {
    id: 'dhaka-bogura',
    name: 'Dhaka - Bogura',
    nameBn: 'ঢাকা → বগুড়া',
    origin: 'Dhaka (Gabtoli)',
    originBn: 'ঢাকা (গাবতলী)',
    destination: 'Bogura',
    destinationBn: 'বগুড়া (চারমাথা/ঠনঠনিয়া)',
    highwayCode: 'N5',
    totalDistanceKm: 195,
    estimatedMinutes: 260,
    checkpoints: [
      { id: 'gabtoli_bog', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'tangail_bog', name: 'Tangail Elenga', nameBn: 'টাঙ্গাইল এলেঙ্গা', lat: 24.3364, lng: 89.9234, sequence: 2, distanceKmFromOrigin: 92 },
      { id: 'bridge_bog', name: 'Jamuna Bridge West', nameBn: 'যমুনা সেতু পশ্চিম গোলচত্বর', lat: 24.4170, lng: 89.7225, sequence: 3, distanceKmFromOrigin: 125 },
      { id: 'sherpur_bog', name: 'Sherpur Bogura Highway', nameBn: 'শেরপুর বগুড়া হাইওয়ে', lat: 24.6700, lng: 89.4300, sequence: 4, distanceKmFromOrigin: 170 },
      { id: 'bogura_bog', name: 'Bogura Charmatha Bus Terminal', nameBn: 'বগুড়া চারমাথা টার্মিনাল', lat: 24.8510, lng: 89.3697, sequence: 5, distanceKmFromOrigin: 195 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [24.3364, 89.9234],
      [24.4170, 89.7225],
      [24.6700, 89.4300],
      [24.8510, 89.3697]
    ]
  },
  {
    id: 'dhaka-dinajpur',
    name: 'Dhaka - Dinajpur',
    nameBn: 'ঢাকা → দিনাজপুর',
    origin: 'Dhaka (Gabtoli/Kalyanpur)',
    originBn: 'ঢাকা (গাবতলী/কল্যাণপুর)',
    destination: 'Dinajpur',
    destinationBn: 'দিনাজপুর (বালুবাড়ি/টার্মিনাল)',
    highwayCode: 'N5 / N508',
    totalDistanceKm: 340,
    estimatedMinutes: 430,
    checkpoints: [
      { id: 'gabtoli_dnj', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'tangail_dnj', name: 'Tangail Elenga', nameBn: 'টাঙ্গাইল এলেঙ্গা', lat: 24.3364, lng: 89.9234, sequence: 2, distanceKmFromOrigin: 92 },
      { id: 'bridge_dnj', name: 'Jamuna Bridge West', nameBn: 'যমুনা সেতু পশ্চিম গোলচত্বর', lat: 24.4170, lng: 89.7225, sequence: 3, distanceKmFromOrigin: 125 },
      { id: 'sherpur_dnj', name: 'Sherpur Bogura Highway', nameBn: 'শেরপুর বগুড়া হাইওয়ে', lat: 24.6700, lng: 89.4300, sequence: 4, distanceKmFromOrigin: 170 },
      { id: 'bogura_dnj', name: 'Bogura Charmatha', nameBn: 'বগুড়া চারমাথা', lat: 24.8510, lng: 89.3697, sequence: 5, distanceKmFromOrigin: 195 },
      { id: 'gobindaganj_dnj', name: 'Gobindaganj Bypass', nameBn: 'গোবিন্দগঞ্জ বাইপাস', lat: 25.1320, lng: 89.3470, sequence: 6, distanceKmFromOrigin: 230 },
      { id: 'birampur_dnj', name: 'Birampur Bus Stand', nameBn: 'বিরামপুর বাস স্ট্যান্ড', lat: 25.3900, lng: 88.9800, sequence: 7, distanceKmFromOrigin: 280 },
      { id: 'fulbari_dnj', name: 'Fulbari Mor', nameBn: 'ফুলবাড়ী মোড়', lat: 25.5100, lng: 88.8800, sequence: 8, distanceKmFromOrigin: 305 },
      { id: 'dinajpur_dnj', name: 'Dinajpur Balubari / Bus Terminal', nameBn: 'দিনাজপুর বালুবাড়ি টার্মিনাল', lat: 25.6279, lng: 88.6332, sequence: 9, distanceKmFromOrigin: 340 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [24.3364, 89.9234],
      [24.4170, 89.7225],
      [24.6700, 89.4300],
      [24.8510, 89.3697],
      [25.1320, 89.3470],
      [25.3900, 88.9800],
      [25.5100, 88.8800],
      [25.6279, 88.6332]
    ]
  },
  {
    id: 'dhaka-sherpur-bogura',
    name: 'Dhaka - Sherpur (Bogura)',
    nameBn: 'ঢাকা → শেরপুর (বগুড়া)',
    origin: 'Dhaka (Gabtoli)',
    originBn: 'ঢাকা (গাবতলী)',
    destination: 'Sherpur, Bogura',
    destinationBn: 'শেরপুর (বগুড়া)',
    highwayCode: 'N5',
    totalDistanceKm: 170,
    estimatedMinutes: 230,
    checkpoints: [
      { id: 'gabtoli_shb', name: 'Gabtoli Terminal', nameBn: 'গাবতলী টার্মিনাল', lat: 23.7847, lng: 90.3524, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'chandra_shb', name: 'Chandra Trimor', nameBn: 'চন্দ্রা ত্রিমোড়', lat: 24.0381, lng: 90.2442, sequence: 2, distanceKmFromOrigin: 42 },
      { id: 'tangail_shb', name: 'Tangail Elenga', nameBn: 'টাঙ্গাইল এলেঙ্গা', lat: 24.3364, lng: 89.9234, sequence: 3, distanceKmFromOrigin: 92 },
      { id: 'bridge_shb', name: 'Jamuna Bridge West', nameBn: 'যমুনা সেতু পশ্চিম গোলচত্বর', lat: 24.4170, lng: 89.7225, sequence: 4, distanceKmFromOrigin: 125 },
      { id: 'chandaikona_shb', name: 'Chandaikona Bazar', nameBn: 'চান্দাইকোনা বাজার', lat: 24.5200, lng: 89.5800, sequence: 5, distanceKmFromOrigin: 145 },
      { id: 'sherpur_shb', name: 'Sherpur Bus Stand (Bogura)', nameBn: 'শেরপুর বাস স্ট্যান্ড (বগুড়া)', lat: 24.6700, lng: 89.4300, sequence: 6, distanceKmFromOrigin: 170 }
    ],
    pathCoordinates: [
      [23.7847, 90.3524],
      [24.0381, 90.2442],
      [24.3364, 89.9234],
      [24.4170, 89.7225],
      [24.5200, 89.5800],
      [24.6700, 89.4300]
    ]
  },
  {
    id: 'dhaka-sherpur-mymensingh',
    name: 'Dhaka - Sherpur (Mymensingh)',
    nameBn: 'ঢাকা → শেরপুর (ময়মনসিংহ)',
    origin: 'Dhaka (Mohakhali)',
    originBn: 'ঢাকা (মহাখালী)',
    destination: 'Sherpur, Mymensingh',
    destinationBn: 'শেরপুর (ময়মনসিংহ সদর)',
    highwayCode: 'N3 / R370',
    totalDistanceKm: 188,
    estimatedMinutes: 250,
    checkpoints: [
      { id: 'mohakhali_shm', name: 'Mohakhali Terminal', nameBn: 'মহাখালী টার্মিনাল', lat: 23.7776, lng: 90.4005, sequence: 1, distanceKmFromOrigin: 0 },
      { id: 'gazipur_shm', name: 'Gazipur Chourasta', nameBn: 'গাজীপুর চৌরাস্তা', lat: 23.9989, lng: 90.3800, sequence: 2, distanceKmFromOrigin: 30 },
      { id: 'valuka_shm', name: 'Bhaluka Bus Stand', nameBn: 'ভালুকা বাস স্ট্যান্ড', lat: 24.2300, lng: 90.3800, sequence: 3, distanceKmFromOrigin: 75 },
      { id: 'mymensingh_shm', name: 'Mymensingh Bypass', nameBn: 'ময়মনসিংহ বাইপাস', lat: 24.7471, lng: 90.4203, sequence: 4, distanceKmFromOrigin: 120 },
      { id: 'nakla_shm', name: 'Nakla Bypass', nameBn: 'নকলা বাইপাস', lat: 24.9800, lng: 90.1800, sequence: 5, distanceKmFromOrigin: 160 },
      { id: 'sherpur_shm', name: 'Sherpur Bus Terminal (Mymensingh)', nameBn: 'শেরপুর বাস টার্মিনাল (ময়মনসিংহ)', lat: 25.0200, lng: 90.0150, sequence: 6, distanceKmFromOrigin: 188 }
    ],
    pathCoordinates: [
      [23.7776, 90.4005],
      [23.9989, 90.3800],
      [24.2300, 90.3800],
      [24.7471, 90.4203],
      [24.9800, 90.1800],
      [25.0200, 90.0150]
    ]
  }
];

// Comprehensive Bangladesh Geocoded Places, Terminals, Districts & Counters
export interface BDPlaceStop {
  id: string;
  nameBn: string;
  nameEn: string;
  districtBn: string;
  districtEn: string;
  lat: number;
  lng: number;
  category: 'terminal' | 'counter' | 'district' | 'highway_junction' | 'checkpoint';
}

export const BD_POPULAR_STOPS_COUNTERS: BDPlaceStop[] = [
  // Dhaka Major Counters & Terminals
  { id: 'dhaka-gabtoli', nameBn: 'ঢাকা (গাবতলী টার্মিনাল)', nameEn: 'Dhaka (Gabtoli Terminal)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7847, lng: 90.3524, category: 'terminal' },
  { id: 'dhaka-mohakhali', nameBn: 'ঢাকা (মহাখালী টার্মিনাল)', nameEn: 'Dhaka (Mohakhali Terminal)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7776, lng: 90.4005, category: 'terminal' },
  { id: 'dhaka-sayedabad', nameBn: 'ঢাকা (সায়েদাবাদ টার্মিনাল)', nameEn: 'Dhaka (Sayedabad Terminal)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7145, lng: 90.4285, category: 'terminal' },
  { id: 'dhaka-kalyanpur', nameBn: 'ঢাকা (কল্যাণপুর কাউন্টার)', nameEn: 'Dhaka (Kalyanpur Counter)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7788, lng: 90.3592, category: 'counter' },
  { id: 'dhaka-shyamoli', nameBn: 'ঢাকা (শ্যামলী কাউন্টার)', nameEn: 'Dhaka (Shyamoli Counter)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7725, lng: 90.3644, category: 'counter' },
  { id: 'dhaka-abdullahpur', nameBn: 'ঢাকা (আবদুল্লাহপুর উত্তরা)', nameEn: 'Dhaka (Abdullahpur Uttara)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.8788, lng: 90.3956, category: 'counter' },
  { id: 'dhaka-airport', nameBn: 'ঢাকা (বিমানবন্দর বাস স্ট্যান্ড)', nameEn: 'Dhaka (Airport Bus Stand)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.8517, lng: 90.4078, category: 'counter' },
  { id: 'dhaka-jatrabari', nameBn: 'ঢাকা (যাত্রাবাড়ী মোড়)', nameEn: 'Dhaka (Jatrabari)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7073, lng: 90.4357, category: 'counter' },
  { id: 'dhaka-fakirapool', nameBn: 'ঢাকা (ফকিরাপুল / আরামবাগ)', nameEn: 'Dhaka (Fakirapool / Arambagh)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7314, lng: 90.4180, category: 'counter' },
  { id: 'dhaka-mirpur10', nameBn: 'ঢাকা (মিরপুর-১০)', nameEn: 'Dhaka (Mirpur 10)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.8069, lng: 90.3687, category: 'counter' },
  { id: 'dhaka-farmgate', nameBn: 'ঢাকা (ফার্মগেট)', nameEn: 'Dhaka (Farmgate)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.7561, lng: 90.3872, category: 'counter' },
  { id: 'savar', nameBn: 'সাভার (বাস স্ট্যান্ড)', nameEn: 'Savar (Bus Stand)', districtBn: 'ঢাকা', districtEn: 'Dhaka', lat: 23.8442, lng: 90.2582, category: 'counter' },
  { id: 'chandra', nameBn: 'চন্দ্রা (ত্রিমোড় হাইওয়ে জংশন)', nameEn: 'Chandra (Highway Junction)', districtBn: 'গাজীপুর', districtEn: 'Gazipur', lat: 24.0381, lng: 90.2442, category: 'highway_junction' },
  { id: 'gazipur', nameBn: 'গাজীপুর (চৌরাস্তা)', nameEn: 'Gazipur (Chowrasta)', districtBn: 'গাজীপুর', districtEn: 'Gazipur', lat: 23.9989, lng: 90.3800, category: 'terminal' },

  // Rajshahi & North Bengal Hubs (Sirajganj, Bogura, Sherpur, Dinajpur etc.)
  { id: 'sirajganj', nameBn: 'সিরাজগঞ্জ (সেন্ট্রাল কাউন্টার/বাজার)', nameEn: 'Sirajganj (Central Counter)', districtBn: 'সিরাজগঞ্জ', districtEn: 'Sirajganj', lat: 24.4534, lng: 89.7000, category: 'district' },
  { id: 'sirajganj-kadda', nameBn: 'সিরাজগঞ্জ (কড্ডা গোলচত্বর)', nameEn: 'Sirajganj (Kadda Golchattor)', districtBn: 'সিরাজগঞ্জ', districtEn: 'Sirajganj', lat: 24.4170, lng: 89.7225, category: 'highway_junction' },
  { id: 'sirajganj-hatikumrul', nameBn: 'হাটিকুমরুল (গোলচত্বর হাইওয়ে)', nameEn: 'Hatikumrul (Golchattor)', districtBn: 'সিরাজগঞ্জ', districtEn: 'Sirajganj', lat: 24.4180, lng: 89.5460, category: 'highway_junction' },
  { id: 'bogura', nameBn: 'বগুড়া (চারমাথা টার্মিনাল)', nameEn: 'Bogura (Charmatha Terminal)', districtBn: 'বগুড়া', districtEn: 'Bogura', lat: 24.8510, lng: 89.3697, category: 'district' },
  { id: 'bogura-thonthonia', nameBn: 'বগুড়া (ঠনঠনিয়া বাস টার্মিনাল)', nameEn: 'Bogura (Thonthonia Terminal)', districtBn: 'বগুড়া', districtEn: 'Bogura', lat: 24.8390, lng: 89.3750, category: 'terminal' },
  { id: 'sherpur-bogura', nameBn: 'শেরপুর, বগুড়া (হাইওয়ে কাউন্টার)', nameEn: 'Sherpur, Bogura (Highway Counter)', districtBn: 'বগুড়া', districtEn: 'Bogura', lat: 24.6700, lng: 89.4300, category: 'counter' },
  { id: 'dinajpur', nameBn: 'দিনাজপুর (বালুবাড়ি টার্মিনাল)', nameEn: 'Dinajpur (Balubari Terminal)', districtBn: 'দিনাজপুর', districtEn: 'Dinajpur', lat: 25.6279, lng: 88.6332, category: 'district' },
  { id: 'birampur', nameBn: 'বিরামপুর (দিনাজপুর)', nameEn: 'Birampur (Dinajpur)', districtBn: 'দিনাজপুর', districtEn: 'Dinajpur', lat: 25.3900, lng: 88.9800, category: 'counter' },
  { id: 'fulbari', nameBn: 'ফুলবাড়ী (দিনাজপুর)', nameEn: 'Fulbari (Dinajpur)', districtBn: 'দিনাজপুর', districtEn: 'Dinajpur', lat: 25.5100, lng: 88.8800, category: 'counter' },
  { id: 'rangpur', nameBn: 'রংপুর (মডার্ন মোড়/কামারপাড়া)', nameEn: 'Rangpur (Modern Mor / Kamarpara)', districtBn: 'রংপুর', districtEn: 'Rangpur', lat: 25.7439, lng: 89.2752, category: 'district' },
  { id: 'rajshahi', nameBn: 'রাজশাহী (শিরোইল টার্মিনাল/রেলগেট)', nameEn: 'Rajshahi (Shiroil Terminal)', districtBn: 'রাজশাহী', districtEn: 'Rajshahi', lat: 24.3745, lng: 88.6042, category: 'district' },
  { id: 'natore', nameBn: 'নাটোর (মাদ্রাসা মোড়)', nameEn: 'Natore (Madrasha Mor)', districtBn: 'নাটোর', districtEn: 'Natore', lat: 24.4102, lng: 88.9790, category: 'district' },
  { id: 'pabna', nameBn: 'পাবনা (সেন্ট্রাল বাস টার্মিনাল)', nameEn: 'Pabna (Central Bus Terminal)', districtBn: 'পাবনা', districtEn: 'Pabna', lat: 24.0064, lng: 89.2372, category: 'district' },
  { id: 'tangail', nameBn: 'টাঙ্গাইল (এলেঙ্গা বাইপাস)', nameEn: 'Tangail (Elenga Bypass)', districtBn: 'টাঙ্গাইল', districtEn: 'Tangail', lat: 24.3364, lng: 89.9234, category: 'district' },
  { id: 'naogaon', nameBn: 'নওগাঁ (বালুডাঙ্গা বাস স্ট্যান্ড)', nameEn: 'Naogaon (Baludanga Bus Stand)', districtBn: 'নওগাঁ', districtEn: 'Naogaon', lat: 24.8100, lng: 88.9300, category: 'district' },
  { id: 'joypurhat', nameBn: 'জয়পুরহাট (বাস টার্মিনাল)', nameEn: 'Joypurhat (Bus Terminal)', districtBn: 'জয়পুরহাট', districtEn: 'Joypurhat', lat: 25.1000, lng: 89.0200, category: 'district' },
  { id: 'chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ (শান্তিমোড়)', nameEn: 'Chapainawabganj (Shanti Mor)', districtBn: 'চাঁপাইনবাবগঞ্জ', districtEn: 'Chapainawabganj', lat: 24.5900, lng: 88.2700, category: 'district' },
  { id: 'kurigram', nameBn: 'কুড়িগ্রাম (সেন্ট্রাল বাস টার্মিনাল)', nameEn: 'Kurigram (Central Bus Terminal)', districtBn: 'কুড়িগ্রাম', districtEn: 'Kurigram', lat: 25.8100, lng: 89.6500, category: 'district' },
  { id: 'gaibandha', nameBn: 'গাইবান্ধা (বাস টার্মিনাল)', nameEn: 'Gaibandha (Bus Terminal)', districtBn: 'গাইবান্ধা', districtEn: 'Gaibandha', lat: 25.3200, lng: 89.5400, category: 'district' },
  { id: 'nilphamari-saidpur', nameBn: 'সৈয়দপুর (নীলফামারী)', nameEn: 'Saidpur (Nilphamari)', districtBn: 'নীলফামারী', districtEn: 'Nilphamari', lat: 25.7700, lng: 88.8900, category: 'counter' },
  { id: 'thakurgaon', nameBn: 'ঠাকুরগাঁও (পুরোনো বাস স্ট্যান্ড)', nameEn: 'Thakurgaon (Old Bus Stand)', districtBn: 'ঠাকুরগাঁও', districtEn: 'Thakurgaon', lat: 26.0300, lng: 88.4600, category: 'district' },
  { id: 'panchagarh', nameBn: 'পঞ্চগড় (সেন্ট্রাল টার্মিনাল)', nameEn: 'Panchagarh (Central Terminal)', districtBn: 'পঞ্চগড়', districtEn: 'Panchagarh', lat: 26.3300, lng: 88.5500, category: 'district' },

  // Chattogram & Cox's Bazar Region
  { id: 'chattogram', nameBn: 'চট্টগ্রাম (অলংকার / একে খান / দামপাড়া)', nameEn: 'Chattogram (Alangkar / AK Khan / Dampara)', districtBn: 'চট্টগ্রাম', districtEn: 'Chattogram', lat: 22.3569, lng: 91.7832, category: 'district' },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার (কলাতলী / সুগন্ধা পয়েন্ট)', nameEn: 'Cox\'s Bazar (Kolatoli)', districtBn: 'কক্সবাজার', districtEn: 'Cox\'s Bazar', lat: 21.4272, lng: 91.9790, category: 'district' },
  { id: 'comilla', nameBn: 'কুমিল্লা (পদুয়ার বাজার বিশ্বরোড)', nameEn: 'Comilla (Paduar Bazar)', districtBn: 'কুমিল্লা', districtEn: 'Comilla', lat: 23.4243, lng: 91.1718, category: 'district' },
  { id: 'feni', nameBn: 'ফেনী (মহিপাল ওভারপাস)', nameEn: 'Feni (Mahipal Overpass)', districtBn: 'ফেনী', districtEn: 'Feni', lat: 23.0159, lng: 91.3976, category: 'district' },
  { id: 'noakhali', nameBn: 'নোয়াখালী (মাইজদী কোর্ট)', nameEn: 'Noakhali (Maijdee Court)', districtBn: 'নোয়াখালী', districtEn: 'Noakhali', lat: 22.8700, lng: 91.1000, category: 'district' },
  { id: 'chandpur', nameBn: 'চাঁদপুর (বাস স্ট্যান্ড)', nameEn: 'Chandpur (Bus Stand)', districtBn: 'চাঁদপুর', districtEn: 'Chandpur', lat: 23.2300, lng: 90.6600, category: 'district' },
  { id: 'brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া (কাউতলী)', nameEn: 'Brahmanbaria (Kautoli)', districtBn: 'ব্রাহ্মণবাড়িয়া', districtEn: 'Brahmanbaria', lat: 23.9600, lng: 91.1100, category: 'district' },

  // Sylhet Region
  { id: 'sylhet', nameBn: 'সিলেট (কদমতলী কেন্দ্রীয় টার্মিনাল)', nameEn: 'Sylhet (Kadomtoli Terminal)', districtBn: 'সিলেট', districtEn: 'Sylhet', lat: 24.8864, lng: 91.8697, category: 'district' },
  { id: 'moulvibazar', nameBn: 'মৌলভীবাজার (কুসুমবাগ মোড়)', nameEn: 'Moulvibazar (Kusumbag Mor)', districtBn: 'মৌলভীবাজার', districtEn: 'Moulvibazar', lat: 24.4800, lng: 91.7700, category: 'district' },
  { id: 'sreemangal', nameBn: 'শ্রীমঙ্গল (চৌমুহনা)', nameEn: 'Sreemangal (Choumuhana)', districtBn: 'মৌলভীবাজার', districtEn: 'Moulvibazar', lat: 24.3100, lng: 91.7300, category: 'counter' },
  { id: 'habiganj', nameBn: 'হবিগঞ্জ (শায়েস্তাগঞ্জ হাইওয়ে)', nameEn: 'Habiganj (Shayestaganj)', districtBn: 'হবিগঞ্জ', districtEn: 'Habiganj', lat: 24.2833, lng: 91.4333, category: 'district' },
  { id: 'sunamganj', nameBn: 'সুনামগঞ্জ (নতুন বাস স্ট্যান্ড)', nameEn: 'Sunamganj (New Bus Stand)', districtBn: 'সুনামগঞ্জ', districtEn: 'Sunamganj', lat: 25.0700, lng: 91.4000, category: 'district' },

  // Khulna & South-West (Padma Bridge Corridor)
  { id: 'khulna', nameBn: 'খুলনা (রয়্যাল মোড় / সোনাডাঙ্গা টার্মিনাল)', nameEn: 'Khulna (Royal Mor / Sonadanga)', districtBn: 'খুলনা', districtEn: 'Khulna', lat: 22.8157, lng: 89.5539, category: 'district' },
  { id: 'jashore', nameBn: 'যশোর (মনিহার বাস টার্মিনাল)', nameEn: 'Jashore (Monihar Terminal)', districtBn: 'যশোর', districtEn: 'Jashore', lat: 23.1667, lng: 89.2167, category: 'district' },
  { id: 'kushtia', nameBn: 'কুষ্টিয়া (মজমপুর গেট)', nameEn: 'Kushtia (Mojumpur Gate)', districtBn: 'কুষ্টিয়া', districtEn: 'Kushtia', lat: 23.9010, lng: 89.1200, category: 'district' },
  { id: 'faridpur', nameBn: 'ফরিদপুর (নতুন বাস স্ট্যান্ড)', nameEn: 'Faridpur (New Bus Stand)', districtBn: 'ফরিদপুর', districtEn: 'Faridpur', lat: 23.6070, lng: 89.8400, category: 'district' },
  { id: 'bhanga', nameBn: 'ভাঙ্গা (হাইওয়ে ইন্টারচেঞ্জ)', nameEn: 'Bhanga (Highway Interchange)', districtBn: 'ফরিদপুর', districtEn: 'Faridpur', lat: 23.3831, lng: 89.9882, category: 'highway_junction' },
  { id: 'gopalganj', nameBn: 'গোপালগঞ্জ (পুলিশ লাইন মোড়)', nameEn: 'Gopalganj (Police Line Mor)', districtBn: 'গোপালগঞ্জ', districtEn: 'Gopalganj', lat: 23.0051, lng: 89.8266, category: 'district' },
  { id: 'satkhira', nameBn: 'সাতক্ষীরা (বাস টার্মিনাল)', nameEn: 'Satkhira (Bus Terminal)', districtBn: 'সাতক্ষীরা', districtEn: 'Satkhira', lat: 22.7100, lng: 89.0700, category: 'district' },
  { id: 'chuadanga', nameBn: 'চুয়াডাঙ্গা (বড়বাজার)', nameEn: 'Chuadanga (Barobazar)', districtBn: 'চুয়াডাঙ্গা', districtEn: 'Chuadanga', lat: 23.6400, lng: 88.8500, category: 'district' },
  { id: 'jhenaidah', nameBn: 'ঝিনাইদহ (আরাপপুর)', nameEn: 'Jhenaidah (Arappur)', districtBn: 'ঝিনাইদহ', districtEn: 'Jhenaidah', lat: 23.5400, lng: 89.1700, category: 'district' },

  // Barishal Region
  { id: 'barishal', nameBn: 'বরিশাল (নথুল্লাবাদ কেন্দ্রীয় টার্মিনাল)', nameEn: 'Barishal (Nathullabad Terminal)', districtBn: 'বরিশাল', districtEn: 'Barishal', lat: 22.7010, lng: 90.3535, category: 'district' },
  { id: 'patuakhali', nameBn: 'পটুয়াখালী (কুয়াকাটা সংযোগ টার্মিনাল)', nameEn: 'Patuakhali (Kuakata Highway Terminal)', districtBn: 'পটুয়াখালী', districtEn: 'Patuakhali', lat: 22.3500, lng: 90.3300, category: 'district' },
  { id: 'madaripur', nameBn: 'মাদারীপুর (মোস্তফাপুর মোড়)', nameEn: 'Madaripur (Mustafapur Mor)', districtBn: 'মাদারীপুর', districtEn: 'Madaripur', lat: 23.1600, lng: 90.1800, category: 'district' },

  // Mymensingh Region & Sherpur Mymensingh
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ (মাসকান্দা টার্মিনাল)', nameEn: 'Mymensingh (Maskanda Terminal)', districtBn: 'ময়মনসিংহ', districtEn: 'Mymensingh', lat: 24.7471, lng: 90.4203, category: 'district' },
  { id: 'sherpur-mymensingh', nameBn: 'শেরপুর, ময়মনসিংহ (বাস টার্মিনাল)', nameEn: 'Sherpur, Mymensingh (Bus Terminal)', districtBn: 'শেরপুর', districtEn: 'Sherpur', lat: 25.0200, lng: 90.0150, category: 'district' },
  { id: 'jamalpur', nameBn: 'জামালপুর (সেন্ট্রাল টার্মিনাল)', nameEn: 'Jamalpur (Central Terminal)', districtBn: 'জামালপুর', districtEn: 'Jamalpur', lat: 24.9300, lng: 89.9400, category: 'district' },
  { id: 'netrokona', nameBn: 'নেত্রকোণা (বাস টার্মিনাল)', nameEn: 'Netrokona (Bus Terminal)', districtBn: 'নেত্রকোণা', districtEn: 'Netrokona', lat: 24.8800, lng: 90.7200, category: 'district' }
];

// Smart Geocoding helper for Bangladesh Places and Counters
export function geocodeLocation(query: string): BDPlaceStop | null {
  if (!query || !query.trim()) return null;
  const q = query.toLowerCase().trim();

  // 1. Direct ID or Name Match
  const exact = BD_POPULAR_STOPS_COUNTERS.find(
    (s) =>
      s.id.toLowerCase() === q ||
      s.nameBn.toLowerCase() === q ||
      s.nameEn.toLowerCase() === q ||
      s.districtBn.toLowerCase() === q ||
      s.districtEn.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Partial Substring Match
  const partial = BD_POPULAR_STOPS_COUNTERS.find(
    (s) =>
      s.nameBn.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.districtBn.toLowerCase().includes(q) ||
      s.districtEn.toLowerCase().includes(q)
  );
  return partial || null;
}

// Build smart Direction between any Origin Stop and Destination Stop
export function buildRouteDirection(
  originStopText: string,
  destinationStopText: string
): {
  routeId: string;
  routeNameEn: string;
  routeNameBn: string;
  originBn: string;
  destinationBn: string;
  originGeo: { lat: number; lng: number; nameBn: string };
  destinationGeo: { lat: number; lng: number; nameBn: string };
  pathCoordinates: [number, number][];
  totalDistanceKm: number;
  estimatedMinutes: number;
  checkpoints: RouteCheckpoint[];
} {
  const originGeoMatch = geocodeLocation(originStopText) || {
    id: 'custom-orig',
    nameBn: originStopText || 'ঢাকা (শুরু কাউন্টার)',
    nameEn: originStopText || 'Origin Stop',
    districtBn: 'ঢাকা',
    districtEn: 'Dhaka',
    lat: 23.7847, // Default Gabtoli
    lng: 90.3524,
    category: 'counter' as const
  };

  const destinationGeoMatch = geocodeLocation(destinationStopText) || {
    id: 'custom-dest',
    nameBn: destinationStopText || 'গন্তব্য কাউন্টার',
    nameEn: destinationStopText || 'Destination Stop',
    districtBn: destinationStopText,
    districtEn: destinationStopText,
    lat: 24.4534, // Default Sirajganj
    lng: 89.7000,
    category: 'counter' as const
  };

  // Check if we have an existing predefined highway route matching origin & destination
  const matchedRoute = BUS_ROUTES.find((r) => {
    const oMatch = r.originBn.includes(originGeoMatch.districtBn) || originGeoMatch.nameBn.includes(r.originBn) || r.originBn.includes('ঢাকা');
    const dMatch = r.destinationBn.includes(destinationGeoMatch.districtBn) || destinationGeoMatch.nameBn.includes(r.destinationBn);
    return oMatch && dMatch;
  });

  if (matchedRoute) {
    return {
      routeId: matchedRoute.id,
      routeNameEn: `${originGeoMatch.nameEn} - ${destinationGeoMatch.nameEn}`,
      routeNameBn: `${originGeoMatch.nameBn} → ${destinationGeoMatch.nameBn}`,
      originBn: originGeoMatch.nameBn,
      destinationBn: destinationGeoMatch.nameBn,
      originGeo: { lat: originGeoMatch.lat, lng: originGeoMatch.lng, nameBn: originGeoMatch.nameBn },
      destinationGeo: { lat: destinationGeoMatch.lat, lng: destinationGeoMatch.lng, nameBn: destinationGeoMatch.nameBn },
      pathCoordinates: matchedRoute.pathCoordinates,
      totalDistanceKm: matchedRoute.totalDistanceKm,
      estimatedMinutes: matchedRoute.estimatedMinutes,
      checkpoints: matchedRoute.checkpoints
    };
  }

  // Calculate direct distance & build realistic highway waypoint coordinates
  const straightDist = calculateDistanceKm(
    originGeoMatch.lat,
    originGeoMatch.lng,
    destinationGeoMatch.lat,
    destinationGeoMatch.lng
  );
  const roadFactor = 1.25; // Highway curvature factor
  const roadDist = Math.round(straightDist * roadFactor);
  const estMins = Math.round((roadDist / 48) * 60);

  // Generate intermediate interpolated highway coordinates
  const steps = 6;
  const path: [number, number][] = [];
  path.push([originGeoMatch.lat, originGeoMatch.lng]);

  for (let i = 1; i < steps; i++) {
    const ratio = i / steps;
    const interpLat = originGeoMatch.lat + (destinationGeoMatch.lat - originGeoMatch.lat) * ratio;
    const interpLng = originGeoMatch.lng + (destinationGeoMatch.lng - originGeoMatch.lng) * ratio;
    // Add small organic highway curve
    const curveOffset = Math.sin(ratio * Math.PI) * 0.018;
    path.push([interpLat + curveOffset, interpLng]);
  }
  path.push([destinationGeoMatch.lat, destinationGeoMatch.lng]);

  const customCheckpoints: RouteCheckpoint[] = [
    {
      id: 'orig-cp',
      name: originGeoMatch.nameEn,
      nameBn: originGeoMatch.nameBn,
      lat: originGeoMatch.lat,
      lng: originGeoMatch.lng,
      sequence: 1,
      distanceKmFromOrigin: 0
    },
    {
      id: 'dest-cp',
      name: destinationGeoMatch.nameEn,
      nameBn: destinationGeoMatch.nameBn,
      lat: destinationGeoMatch.lat,
      lng: destinationGeoMatch.lng,
      sequence: 2,
      distanceKmFromOrigin: roadDist
    }
  ];

  return {
    routeId: `dir-${originGeoMatch.id}-to-${destinationGeoMatch.id}`,
    routeNameEn: `${originGeoMatch.nameEn} to ${destinationGeoMatch.nameEn}`,
    routeNameBn: `${originGeoMatch.nameBn} → ${destinationGeoMatch.nameBn}`,
    originBn: originGeoMatch.nameBn,
    destinationBn: destinationGeoMatch.nameBn,
    originGeo: { lat: originGeoMatch.lat, lng: originGeoMatch.lng, nameBn: originGeoMatch.nameBn },
    destinationGeo: { lat: destinationGeoMatch.lat, lng: destinationGeoMatch.lng, nameBn: destinationGeoMatch.nameBn },
    pathCoordinates: path,
    totalDistanceKm: roadDist,
    estimatedMinutes: estMins,
    checkpoints: customCheckpoints
  };
}

// Simulated real-time traffic condition generator per route
export interface HighwayTrafficSegment {
  checkpointId: string;
  checkpointNameBn: string;
  status: 'clear' | 'moderate' | 'heavy';
  statusBn: string;
  speedAvgKmH: number;
  delayMinutes: number;
  color: string;
}

export function getHighwayTrafficConditions(routeId: string): HighwayTrafficSegment[] {
  const route = BUS_ROUTES.find((r) => r.id === routeId);
  const checkpoints = route ? route.checkpoints : [];

  return checkpoints.map((cp, idx) => {
    // Generate realistic traffic condition based on known bottlenecks (e.g. Toll plazas, Chandra, Elenga, Mahipal)
    const isBottleneck =
      cp.nameBn.includes('টোল') ||
      cp.nameBn.includes('সেতু') ||
      cp.nameBn.includes('চন্দ্রা') ||
      cp.nameBn.includes('এলেঙ্গা') ||
      cp.nameBn.includes('মহিপাল') ||
      cp.nameBn.includes('গাজীপুর') ||
      cp.nameBn.includes('সায়েদাবাদ') ||
      cp.nameBn.includes('কাঁচপুর');

    let status: 'clear' | 'moderate' | 'heavy' = 'clear';
    let statusBn = 'স্বাভাবিক গতি (Clear)';
    let speedAvgKmH = Math.floor(60 + Math.random() * 20);
    let delayMinutes = 0;
    let color = '#10B981'; // green

    if (isBottleneck && idx % 2 === 0) {
      status = 'heavy';
      statusBn = 'যানজট / ধীরগতি (Jam)';
      speedAvgKmH = Math.floor(15 + Math.random() * 15);
      delayMinutes = Math.floor(8 + Math.random() * 12);
      color = '#EF4444'; // red
    } else if (idx % 3 === 0) {
      status = 'moderate';
      statusBn = 'মাঝারি ট্রাফিক (Moderate)';
      speedAvgKmH = Math.floor(35 + Math.random() * 15);
      delayMinutes = Math.floor(3 + Math.random() * 5);
      color = '#F59E0B'; // amber
    }

    return {
      checkpointId: cp.id,
      checkpointNameBn: cp.nameBn,
      status,
      statusBn,
      speedAvgKmH,
      delayMinutes,
      color
    };
  });
}

// Helper calculations
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}


// Find nearest Bangladesh checkpoint and calculate ETA
export function resolveLocationAndETA(
  lat: number,
  lng: number,
  routeId: string,
  currentSpeedKmH: number = 45
): {
  locationNameEn: string;
  locationNameBn: string;
  nextCheckpoint?: {
    nameBn: string;
    nameEn: string;
    distanceKm: number;
    etaMinutesMin: number;
    etaMinutesMax: number;
  };
  destinationEta?: {
    nameBn: string;
    nameEn: string;
    distanceKm: number;
    etaMinutesMin: number;
    etaMinutesMax: number;
  };
} {
  const route = BUS_ROUTES.find((r) => r.id === routeId);

  // Check all known checkpoints across all routes to find closest landmark
  let closestCheckpoint: { name: string; nameBn: string; distance: number } | null = null;
  let minDistance = Infinity;

  const allCheckpoints = BUS_ROUTES.flatMap((r) => r.checkpoints);
  for (const cp of allCheckpoints) {
    const d = calculateDistanceKm(lat, lng, cp.lat, cp.lng);
    if (d < minDistance) {
      minDistance = d;
      closestCheckpoint = { name: cp.name, nameBn: cp.nameBn, distance: d };
    }
  }

  let locationNameBn = 'হাইওয়ে সংযোগ';
  let locationNameEn = 'Highway Route';

  if (closestCheckpoint) {
    if (closestCheckpoint.distance < 1.5) {
      locationNameBn = closestCheckpoint.nameBn;
      locationNameEn = closestCheckpoint.name;
    } else {
      locationNameBn = `${closestCheckpoint.nameBn}-এর কাছে (${closestCheckpoint.distance} কিমি)`;
      locationNameEn = `Near ${closestCheckpoint.name} (${closestCheckpoint.distance} km)`;
    }
  }

  if (!route) {
    return { locationNameEn, locationNameBn };
  }

  // Find next checkpoint along the selected route
  // We determine where the bus is along the sequence
  let nextCp: (typeof route.checkpoints)[0] | null = null;
  let minCpDist = Infinity;
  let currentCpIndex = 0;

  for (let i = 0; i < route.checkpoints.length; i++) {
    const cp = route.checkpoints[i];
    const dist = calculateDistanceKm(lat, lng, cp.lat, cp.lng);
    if (dist < minCpDist) {
      minCpDist = dist;
      currentCpIndex = i;
    }
  }

  if (currentCpIndex < route.checkpoints.length - 1) {
    nextCp = route.checkpoints[currentCpIndex + 1];
  } else {
    nextCp = route.checkpoints[route.checkpoints.length - 1];
  }

  const effectiveSpeed = Math.max(currentSpeedKmH > 10 ? currentSpeedKmH : 40, 30);

  let nextCheckpointETA = undefined;
  if (nextCp) {
    const distToNext = Math.max(1, calculateDistanceKm(lat, lng, nextCp.lat, nextCp.lng));
    const baseMinutes = Math.round((distToNext / effectiveSpeed) * 60);
    const minMins = Math.max(5, Math.round(baseMinutes * 0.85));
    const maxMins = Math.max(minMins + 5, Math.round(baseMinutes * 1.25));

    nextCheckpointETA = {
      nameBn: nextCp.nameBn,
      nameEn: nextCp.name,
      distanceKm: distToNext,
      etaMinutesMin: minMins,
      etaMinutesMax: maxMins
    };
  }

  const destCp = route.checkpoints[route.checkpoints.length - 1];
  const distToDest = Math.max(2, calculateDistanceKm(lat, lng, destCp.lat, destCp.lng));
  const destBaseMinutes = Math.round((distToDest / effectiveSpeed) * 60);
  const destMinMins = Math.max(10, Math.round(destBaseMinutes * 0.9));
  const destMaxMins = Math.max(destMinMins + 10, Math.round(destBaseMinutes * 1.3));

  const destinationEta = {
    nameBn: destCp.nameBn,
    nameEn: destCp.name,
    distanceKm: distToDest,
    etaMinutesMin: destMinMins,
    etaMinutesMax: destMaxMins
  };

  return {
    locationNameEn,
    locationNameBn,
    nextCheckpoint: nextCheckpointETA,
    destinationEta
  };
}

export function formatBanglaTimeAgo(msTimestamp: number): string {
  const now = Date.now();
  const diffSec = Math.max(1, Math.floor((now - msTimestamp) / 1000));

  const toBnNumber = (num: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
  };

  if (diffSec < 60) {
    return `${toBnNumber(diffSec)} সেকেন্ড আগে`;
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${toBnNumber(diffMin)} মিনিট আগে`;
  }
  const diffHours = Math.floor(diffMin / 60);
  return `${toBnNumber(diffHours)} ঘণ্টা আগে`;
}

export function toBanglaNumber(val: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

export function getDefaultInitialFleet(): any[] {
  return [];
}
