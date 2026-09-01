export interface PlaceLocation {
  nameBn: string;
  nameEn: string;
  districtBn: string;
  districtEn: string;
  category: 'counter' | 'upazila' | 'district' | 'stand';
  lat: number;
  lng: number;
}

export const BD_ALL_PLACES: PlaceLocation[] = [
  // Dhaka District & Upazilas / Stands / Terminals
  { nameBn: "ঢাকা (গাবতলী টার্মিনাল)", nameEn: "Dhaka (Gabtoli)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "counter", lat: 23.7846, lng: 90.3475 },
  { nameBn: "ঢাকা (মহাখালী টার্মিনাল)", nameEn: "Dhaka (Mohakhali)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "counter", lat: 23.7778, lng: 90.4005 },
  { nameBn: "ঢাকা (সায়েদাবাদ টার্মিনাল)", nameEn: "Dhaka (Sayedabad)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "counter", lat: 23.7145, lng: 90.4285 },
  { nameBn: "ঢাকা (কল্যাণপুর কাউন্টার)", nameEn: "Dhaka (Kalyanpur)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "counter", lat: 23.7785, lng: 90.3615 },
  { nameBn: "ঢাকা (আব্দুল্লাহপুর / উত্তরা)", nameEn: "Dhaka (Abdullahpur/Uttara)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "counter", lat: 23.8824, lng: 90.3995 },
  { nameBn: "ঢাকা (দোহার)", nameEn: "Dhaka (Dohar)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "upazila", lat: 23.5937, lng: 90.1345 },
  { nameBn: "ঢাকা (নবাবগঞ্জ)", nameEn: "Dhaka (Nawabganj)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "upazila", lat: 23.6668, lng: 90.1654 },
  { nameBn: "ঢাকা (সাভার / নবীনগর)", nameEn: "Dhaka (Savar/Nabinagar)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "upazila", lat: 23.8583, lng: 90.2667 },
  { nameBn: "ঢাকা (ধামরাই)", nameEn: "Dhaka (Dhamrai)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "upazila", lat: 23.9185, lng: 90.2104 },
  { nameBn: "ঢাকা (কেরানীগঞ্জ)", nameEn: "Dhaka (Keraniganj)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "upazila", lat: 23.6800, lng: 90.3600 },
  { nameBn: "ঢাকা (যাত্রাবাড়ী / চিটাগাং রোড)", nameEn: "Dhaka (Jatrabari/Chittagong Rd)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "stand", lat: 23.7088, lng: 90.4410 },
  { nameBn: "ঢাকা (কমলাপুর / আরামবাগ)", nameEn: "Dhaka (Arambagh/Kamalapur)", districtBn: "ঢাকা", districtEn: "Dhaka", category: "counter", lat: 23.7315, lng: 90.4190 },

  // Gazipur
  { nameBn: "গাজীপুর (চৌরাস্তা)", nameEn: "Gazipur (Chowrasta)", districtBn: "গাজীপুর", districtEn: "Gazipur", category: "stand", lat: 23.9984, lng: 90.3842 },
  { nameBn: "গাজীপুর (টঙ্গী)", nameEn: "Gazipur (Tongi)", districtBn: "গাজীপুর", districtEn: "Gazipur", category: "stand", lat: 23.8967, lng: 90.4042 },
  { nameBn: "গাজীপুর (চন্দ্রা / কালিয়াকৈর)", nameEn: "Gazipur (Chandra/Kaliakair)", districtBn: "গাজীপুর", districtEn: "Gazipur", category: "stand", lat: 24.0385, lng: 90.2395 },
  { nameBn: "গাজীপুর (শ্রীপুর / মাওনা)", nameEn: "Gazipur (Sreepur/Mawna)", districtBn: "গাজীপুর", districtEn: "Gazipur", category: "upazila", lat: 24.2015, lng: 90.4685 },
  { nameBn: "গাজীপুর (কাপাসিয়া)", nameEn: "Gazipur (Kapasia)", districtBn: "গাজীপুর", districtEn: "Gazipur", category: "upazila", lat: 24.1165, lng: 90.5700 },

  // Narayanganj
  { nameBn: "নারায়ণগঞ্জ (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Narayanganj (Central)", districtBn: "নারায়ণগঞ্জ", districtEn: "Narayanganj", category: "district", lat: 23.6238, lng: 90.5000 },
  { nameBn: "নারায়ণগঞ্জ (মদনপুর / সাইনবোর্ড)", nameEn: "Narayanganj (Madanpur)", districtBn: "নারায়ণগঞ্জ", districtEn: "Narayanganj", category: "stand", lat: 23.6845, lng: 90.5475 },
  { nameBn: "নারায়ণগঞ্জ (রূপগঞ্জ / ভুলতা)", nameEn: "Narayanganj (Rupganj/Bhulta)", districtBn: "নারায়ণগঞ্জ", districtEn: "Narayanganj", category: "upazila", lat: 23.7915, lng: 90.5845 },
  { nameBn: "নারায়ণগঞ্জ (সোনারগাঁও)", nameEn: "Narayanganj (Sonargaon)", districtBn: "নারায়ণগঞ্জ", districtEn: "Narayanganj", category: "upazila", lat: 23.6492, lng: 90.6015 },
  { nameBn: "নারায়ণগঞ্জ (আড়াইহাজার)", nameEn: "Narayanganj (Araihazar)", districtBn: "নারায়ণগঞ্জ", districtEn: "Narayanganj", category: "upazila", lat: 23.7915, lng: 90.6540 },

  // Narsingdi
  { nameBn: "নরসিংদী (ভেলানগর / সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Narsingdi (Velanagar)", districtBn: "নরসিংদী", districtEn: "Narsingdi", category: "district", lat: 23.9193, lng: 90.7176 },
  { nameBn: "নরসিংদী (ইটখোলা / শিবপুর)", nameEn: "Narsingdi (Itakhola/Shibpur)", districtBn: "নরসিংদী", districtEn: "Narsingdi", category: "upazila", lat: 24.0150, lng: 90.7410 },
  { nameBn: "নরসিংদী (রায়পুরা)", nameEn: "Narsingdi (Raipura)", districtBn: "নরসিংদী", districtEn: "Narsingdi", category: "upazila", lat: 23.9985, lng: 90.8750 },
  { nameBn: "নরসিংদী (পলাশ)", nameEn: "Narsingdi (Palash)", districtBn: "নরসিংদী", districtEn: "Narsingdi", category: "upazila", lat: 23.9540, lng: 90.6280 },

  // Munshiganj
  { nameBn: "মুন্সীগঞ্জ (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Munshiganj (Central)", districtBn: "মুন্সীগঞ্জ", districtEn: "Munshiganj", category: "district", lat: 23.5422, lng: 90.5305 },
  { nameBn: "মুন্সীগঞ্জ (শ্রীনগর)", nameEn: "Munshiganj (Sreenagar)", districtBn: "মুন্সীগঞ্জ", districtEn: "Munshiganj", category: "upazila", lat: 23.5350, lng: 90.2850 },
  { nameBn: "মুন্সীগঞ্জ (মাওয়া ঘাট / পদ্মা সেতু)", nameEn: "Munshiganj (Mawa Ghat)", districtBn: "মুন্সীগঞ্জ", districtEn: "Munshiganj", category: "stand", lat: 23.4755, lng: 90.2612 },
  { nameBn: "মুন্সীগঞ্জ (সিরাজদিখান)", nameEn: "Munshiganj (Sirajdikhan)", districtBn: "মুন্সীগঞ্জ", districtEn: "Munshiganj", category: "upazila", lat: 23.5710, lng: 90.3910 },
  { nameBn: "মুন্সীগঞ্জ (গজারিয়া)", nameEn: "Munshiganj (Gajaria)", districtBn: "মুন্সীগঞ্জ", districtEn: "Munshiganj", category: "upazila", lat: 23.5320, lng: 90.6120 },

  // Manikganj
  { nameBn: "মানিকগঞ্জ (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Manikganj (Central)", districtBn: "মানিকগঞ্জ", districtEn: "Manikganj", category: "district", lat: 23.8617, lng: 90.0003 },
  { nameBn: "মানিকগঞ্জ (পাটুরিয়া ঘাট)", nameEn: "Manikganj (Paturia Ghat)", districtBn: "মানিকগঞ্জ", districtEn: "Manikganj", category: "stand", lat: 23.8920, lng: 89.7890 },
  { nameBn: "মানিকগঞ্জ (সিংগাইর)", nameEn: "Manikganj (Singair)", districtBn: "মানিকগঞ্জ", districtEn: "Manikganj", category: "upazila", lat: 23.8167, lng: 90.1500 },

  // Chattogram (Chittagong)
  { nameBn: "চট্টগ্রাম (দামপাড়া / জিইসি)", nameEn: "Chattogram (Dampara/GEC)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "counter", lat: 22.3592, lng: 91.8215 },
  { nameBn: "চট্টগ্রাম (অলংকার মোড় / একে খান)", nameEn: "Chattogram (Alankar/AK Khan)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "counter", lat: 22.3789, lng: 91.7850 },
  { nameBn: "চট্টগ্রাম (নতুন ব্রিজ / বহদ্দারহাট)", nameEn: "Chattogram (Bahaddarhat)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "stand", lat: 22.3700, lng: 91.8480 },
  { nameBn: "চট্টগ্রাম (সীতাকুণ্ড)", nameEn: "Chattogram (Sitakunda)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "upazila", lat: 22.6167, lng: 91.6667 },
  { nameBn: "চট্টগ্রাম (মিরসরাই / বারৈয়ারহাট)", nameEn: "Chattogram (Mirsarai/Baraiyarhat)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "upazila", lat: 22.7725, lng: 91.5750 },
  { nameBn: "চট্টগ্রাম (পটিয়া)", nameEn: "Chattogram (Patiya)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "upazila", lat: 22.2965, lng: 91.9810 },
  { nameBn: "চট্টগ্রাম (লোহাগাড়া / চুনতি)", nameEn: "Chattogram (Lohagara)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "upazila", lat: 21.9950, lng: 92.0910 },
  { nameBn: "চট্টগ্রাম (হাটহাজারী)", nameEn: "Chattogram (Hathazari)", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", category: "upazila", lat: 22.5085, lng: 91.8085 },

  // Cox's Bazar
  { nameBn: "কক্সবাজার (ঝাউতলা / কলাতলী)", nameEn: "Cox's Bazar (Kolatoli)", districtBn: "কক্সবাজার", districtEn: "Cox's Bazar", category: "counter", lat: 21.4272, lng: 91.9800 },
  { nameBn: "কক্সবাজার (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Cox's Bazar (Terminal)", districtBn: "কক্সবাজার", districtEn: "Cox's Bazar", category: "district", lat: 21.4339, lng: 92.0058 },
  { nameBn: "কক্সবাজার (টেকনাফ)", nameEn: "Cox's Bazar (Teknaf)", districtBn: "কক্সবাজার", districtEn: "Cox's Bazar", category: "upazila", lat: 20.8633, lng: 92.2980 },
  { nameBn: "কক্সবাজার (চকোরিয়া)", nameEn: "Cox's Bazar (Chakaria)", districtBn: "কক্সবাজার", districtEn: "Cox's Bazar", category: "upazila", lat: 21.7865, lng: 92.0780 },
  { nameBn: "কক্সবাজার (উখিয়া / ইনানী)", nameEn: "Cox's Bazar (Ukhiya)", districtBn: "কক্সবাজার", districtEn: "Cox's Bazar", category: "upazila", lat: 21.2850, lng: 92.1450 },

  // Sylhet
  { nameBn: "সিলেট (কদমতলী টার্মিনাল)", nameEn: "Sylhet (Kadamtali)", districtBn: "সিলেট", districtEn: "Sylhet", category: "district", lat: 24.8825, lng: 91.8685 },
  { nameBn: "সিলেট (সোবহানীঘাট / হুমায়ুন রশীদ চত্বর)", nameEn: "Sylhet (Sobhanighat)", districtBn: "সিলেট", districtEn: "Sylhet", category: "counter", lat: 24.8880, lng: 91.8740 },
  { nameBn: "সিলেট (শ্রীমঙ্গল / মৌলভীবাজার)", nameEn: "Sylhet (Sreemangal)", districtBn: "মৌলভীবাজার", districtEn: "Moulvibazar", category: "upazila", lat: 24.3065, lng: 91.7296 },
  { nameBn: "সিলেট (হবিগঞ্জ সেন্ট্রাল)", nameEn: "Sylhet (Habiganj Central)", districtBn: "হবিগঞ্জ", districtEn: "Habiganj", category: "district", lat: 24.3749, lng: 91.4155 },
  { nameBn: "সিলেট (সুনামগঞ্জ সেন্ট্রাল)", nameEn: "Sylhet (Sunamganj Central)", districtBn: "সুনামগঞ্জ", districtEn: "Sunamganj", category: "district", lat: 25.0658, lng: 91.3950 },
  { nameBn: "সিলেট (গোয়াইনঘাট / জাফলং)", nameEn: "Sylhet (Jaflong)", districtBn: "সিলেট", districtEn: "Sylhet", category: "upazila", lat: 25.1630, lng: 92.0160 },
  { nameBn: "সিলেট (বিয়ানীবাজার)", nameEn: "Sylhet (Beanibazar)", districtBn: "সিলেট", districtEn: "Sylhet", category: "upazila", lat: 24.8250, lng: 92.1620 },

  // Rajshahi Division
  { nameBn: "রাজশাহী (শিরোইল টার্মিনাল)", nameEn: "Rajshahi (Shiroil)", districtBn: "রাজশাহী", districtEn: "Rajshahi", category: "district", lat: 24.3745, lng: 88.6042 },
  { nameBn: "রাজশাহী (নওদাপাড়া টার্মিনাল)", nameEn: "Rajshahi (Naodapara)", districtBn: "রাজশাহী", districtEn: "Rajshahi", category: "stand", lat: 24.4050, lng: 88.6250 },
  { nameBn: "রাজশাহী (বাঘা / চারঘাট)", nameEn: "Rajshahi (Bagha/Charghat)", districtBn: "রাজশাহী", districtEn: "Rajshahi", category: "upazila", lat: 24.1915, lng: 88.7610 },
  { nameBn: "সিরাজগঞ্জ (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Sirajganj (Central)", districtBn: "সিরাজগঞ্জ", districtEn: "Sirajganj", category: "district", lat: 24.4534, lng: 89.7008 },
  { nameBn: "সিরাজগঞ্জ (কড্ডা গোলচত্বর)", nameEn: "Sirajganj (Kadda Roundabout)", districtBn: "সিরাজগঞ্জ", districtEn: "Sirajganj", category: "stand", lat: 24.4172, lng: 89.6720 },
  { nameBn: "সিরাজগঞ্জ (বেলকুচি / শাহজাদপুর)", nameEn: "Sirajganj (Shahjadpur)", districtBn: "সিরাজগঞ্জ", districtEn: "Sirajganj", category: "upazila", lat: 24.1750, lng: 89.5980 },
  { nameBn: "সিরাজগঞ্জ (উল্লাপাড়া)", nameEn: "Sirajganj (Ullapara)", districtBn: "সিরাজগঞ্জ", districtEn: "Sirajganj", category: "upazila", lat: 24.3180, lng: 89.5680 },
  { nameBn: "বগুড়া (চারমাথা কেন্দ্রীয় টার্মিনাল)", nameEn: "Bogra (Charmatha)", districtBn: "বগুড়া", districtEn: "Bogra", category: "district", lat: 24.8510, lng: 89.3450 },
  { nameBn: "বগুড়া (বনানী মোড়)", nameEn: "Bogra (Banani Mor)", districtBn: "বগুড়া", districtEn: "Bogra", category: "stand", lat: 24.8120, lng: 89.3710 },
  { nameBn: "বগুড়া (শেরপুর)", nameEn: "Bogra (Sherpur)", districtBn: "বগুড়া", districtEn: "Bogra", category: "upazila", lat: 24.6750, lng: 89.4210 },
  { nameBn: "পাবনা (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Pabna (Central)", districtBn: "পাবনা", districtEn: "Pabna", category: "district", lat: 23.9985, lng: 89.2330 },
  { nameBn: "পাবনা (ঈশ্বরদী)", nameEn: "Pabna (Ishwardi)", districtBn: "পাবনা", districtEn: "Pabna", category: "upazila", lat: 24.1290, lng: 89.0680 },
  { nameBn: "নাটোর (মাদ্রাসা মোড় / হরিশপুর)", nameEn: "Natore (Harishpur)", districtBn: "নাটোর", districtEn: "Natore", category: "district", lat: 24.4102, lng: 88.9795 },
  { nameBn: "নওগাঁ (বালুডাঙ্গা বাসস্ট্যান্ড)", nameEn: "Naogaon (Baludanga)", districtBn: "নওগাঁ", districtEn: "Naogaon", category: "district", lat: 24.8050, lng: 88.9450 },
  { nameBn: "চাঁপাইনবাবগঞ্জ (সেন্ট্রাল টার্মিনাল)", nameEn: "Chapai Nawabganj (Central)", districtBn: "চাঁপাইনবাবগঞ্জ", districtEn: "Chapai Nawabganj", category: "district", lat: 24.5965, lng: 88.2775 },
  { nameBn: "জয়পুরহাট (সেন্ট্রাল টার্মিনাল)", nameEn: "Joypurhat (Central)", districtBn: "জয়পুরহাট", districtEn: "Joypurhat", category: "district", lat: 25.0968, lng: 89.0227 },

  // Rangpur Division
  { nameBn: "রংপুর (কামারপাড়া ঢাকা বাসস্ট্যান্ড)", nameEn: "Rangpur (Kamarpara)", districtBn: "রংপুর", districtEn: "Rangpur", category: "district", lat: 25.7439, lng: 89.2752 },
  { nameBn: "রংপুর (মেডিকেল মোড়)", nameEn: "Rangpur (Medical Mor)", districtBn: "রংপুর", districtEn: "Rangpur", category: "stand", lat: 25.7620, lng: 89.2380 },
  { nameBn: "দিনাজপুর (কেন্দ্রীয় বাস টার্মিনাল)", nameEn: "Dinajpur (Central)", districtBn: "দিনাজপুর", districtEn: "Dinajpur", category: "district", lat: 25.6279, lng: 88.6332 },
  { nameBn: "দিনাজপুর (হিলি / বিরামপুর)", nameEn: "Dinajpur (Birampur/Hili)", districtBn: "দিনাজপুর", districtEn: "Dinajpur", category: "upazila", lat: 25.2280, lng: 88.9950 },
  { nameBn: "গাইবান্ধা (সেন্ট্রাল টার্মিনাল)", nameEn: "Gaibandha (Central)", districtBn: "গাইবান্ধা", districtEn: "Gaibandha", category: "district", lat: 25.3288, lng: 89.5430 },
  { nameBn: "গাইবান্ধা (পলাশবাড়ী / গোবিন্দগঞ্জ)", nameEn: "Gaibandha (Palashbari/Gobindaganj)", districtBn: "গাইবান্ধা", districtEn: "Gaibandha", category: "upazila", lat: 25.2850, lng: 89.3520 },
  { nameBn: "কুড়িগ্রাম (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Kurigram (Central)", districtBn: "কুড়িগ্রাম", districtEn: "Kurigram", category: "district", lat: 25.8072, lng: 89.6362 },
  { nameBn: "লালমনিরহাট (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Lalmonirhat (Central)", districtBn: "লালমনিরহাট", districtEn: "Lalmonirhat", category: "district", lat: 25.9165, lng: 89.4530 },
  { nameBn: "নীলফামারী (সৈয়দপুর কেন্দ্রীয় টার্মিনাল)", nameEn: "Nilphamari (Saidpur)", districtBn: "নীলফামারী", districtEn: "Nilphamari", category: "upazila", lat: 25.7780, lng: 88.8910 },
  { nameBn: "পঞ্চগড় (সেন্ট্রাল বাসস্ট্যান্ড / তেঁতুলিয়া)", nameEn: "Panchagarh (Central/Tetulia)", districtBn: "পঞ্চগড়", districtEn: "Panchagarh", category: "district", lat: 26.3354, lng: 88.5517 },
  { nameBn: "ঠাকুরগাঁও (সেন্ট্রাল টার্মিনাল)", nameEn: "Thakurgaon (Central)", districtBn: "ঠাকুরগাঁও", districtEn: "Thakurgaon", category: "district", lat: 26.0337, lng: 88.4617 },

  // Khulna Division
  { nameBn: "খুলনা (সোনাডাঙ্গা সেন্ট্রাল টার্মিনাল)", nameEn: "Khulna (Sonadanga)", districtBn: "খুলনা", districtEn: "Khulna", category: "district", lat: 22.8200, lng: 89.5400 },
  { nameBn: "খুলনা (রয়্যাল মোড় কাউন্টার)", nameEn: "Khulna (Royal Mor)", districtBn: "খুলনা", districtEn: "Khulna", category: "counter", lat: 22.8125, lng: 89.5600 },
  { nameBn: "যশোর (মনিহার সেন্ট্রাল টার্মিনাল)", nameEn: "Jashore (Monihar)", districtBn: "যশোর", districtEn: "Jashore", category: "district", lat: 23.1634, lng: 89.2182 },
  { nameBn: "যশোর (বেনাপোল স্থলবন্দর)", nameEn: "Jashore (Benapole Port)", districtBn: "যশোর", districtEn: "Jashore", category: "upazila", lat: 23.0410, lng: 88.8950 },
  { nameBn: "কুষ্টিয়া (মজু খেয়াঘাট / চৌড়হাস)", nameEn: "Kushtia (Chourhas)", districtBn: "কুষ্টিয়া", districtEn: "Kushtia", category: "district", lat: 23.9013, lng: 89.1205 },
  { nameBn: "সাতক্ষীরা (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Satkhira (Central)", districtBn: "সাতক্ষীরা", districtEn: "Satkhira", category: "district", lat: 22.7185, lng: 89.0705 },
  { nameBn: "বাগেরহাট (সেন্ট্রাল বাসস্ট্যান্ড / মোংলা)", nameEn: "Bagerhat (Central/Mongla)", districtBn: "বাগেরহাট", districtEn: "Bagerhat", category: "district", lat: 22.6602, lng: 89.7895 },
  { nameBn: "ঝিনাইদহ (আরাপপুর / কেন্দ্রীয় টার্মিনাল)", nameEn: "Jhenaidah (Arappur)", districtBn: "ঝিনাইদহ", districtEn: "Jhenaidah", category: "district", lat: 23.5450, lng: 89.1720 },
  { nameBn: "মাগুরা (ঢাকা রোড বাসস্ট্যান্ড)", nameEn: "Magura (Dhaka Rd)", districtBn: "মাগুরা", districtEn: "Magura", category: "district", lat: 23.4855, lng: 89.4198 },
  { nameBn: "চুয়াডাঙ্গা (সেন্ট্রাল টার্মিনাল / দর্শনা)", nameEn: "Chuadanga (Central/Darshana)", districtBn: "চুয়াডাঙ্গা", districtEn: "Chuadanga", category: "district", lat: 23.6402, lng: 88.8418 },
  { nameBn: "মেহেরপুর (সেন্ট্রাল বাসস্ট্যান্ড / মুজিবনগর)", nameEn: "Meherpur (Central)", districtBn: "মেহেরপুর", districtEn: "Meherpur", category: "district", lat: 23.7745, lng: 88.6315 },
  { nameBn: "নড়াইল (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Narail (Central)", districtBn: "নড়াইল", districtEn: "Narail", category: "district", lat: 23.1725, lng: 89.5127 },

  // Barishal Division
  { nameBn: "বরিশাল (নথুল্লাবাদ কেন্দ্রীয় টার্মিনাল)", nameEn: "Barishal (Nathullabad)", districtBn: "বরিশাল", districtEn: "Barishal", category: "district", lat: 22.7125, lng: 90.3540 },
  { nameBn: "বরিশাল (রূপাতলী টার্মিনাল)", nameEn: "Barishal (Rupatoli)", districtBn: "বরিশাল", districtEn: "Barishal", category: "stand", lat: 22.6780, lng: 90.3510 },
  { nameBn: "পটুয়াখালী (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Patuakhali (Central)", districtBn: "পটুয়াখালী", districtEn: "Patuakhali", category: "district", lat: 22.3596, lng: 90.3298 },
  { nameBn: "পটুয়াখালী (কুয়াকাটা সমুদ্র সৈকত)", nameEn: "Patuakhali (Kuakata)", districtBn: "পটুয়াখালী", districtEn: "Patuakhali", category: "upazila", lat: 21.8167, lng: 90.1167 },
  { nameBn: "ভোলা (সেন্ট্রাল বাসস্ট্যান্ড / ইলিশা ঘাট)", nameEn: "Bhola (Central/Ilisha)", districtBn: "ভোলা", districtEn: "Bhola", category: "district", lat: 22.6859, lng: 90.6482 },
  { nameBn: "পিরোজপুর (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Pirojpur (Central)", districtBn: "পিরোজপুর", districtEn: "Pirojpur", category: "district", lat: 22.5791, lng: 89.9752 },
  { nameBn: "ঝালকাঠি (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Jhalokathi (Central)", districtBn: "ঝালকাঠি", districtEn: "Jhalokathi", category: "district", lat: 22.6406, lng: 90.1987 },
  { nameBn: "বরগুনা (সেন্ট্রাল বাসস্ট্যান্ড / পাথরঘাটা)", nameEn: "Barguna (Central)", districtBn: "বরগুনা", districtEn: "Barguna", category: "district", lat: 22.1570, lng: 90.1250 },

  // Mymensingh Division
  { nameBn: "ময়মনসিংহ (মাসকান্দা কেন্দ্রীয় টার্মিনাল)", nameEn: "Mymensingh (Maskanda)", districtBn: "ময়মনসিংহ", districtEn: "Mymensingh", category: "district", lat: 24.7435, lng: 90.4120 },
  { nameBn: "ময়মনসিংহ (ব্রিজ মোড় / পাটগুদাম)", nameEn: "Mymensingh (Patgudam)", districtBn: "ময়মনসিংহ", districtEn: "Mymensingh", category: "stand", lat: 24.7550, lng: 90.4190 },
  { nameBn: "ময়মনসিংহ (মুক্তাগাছা / ফুলবাড়িয়া)", nameEn: "Mymensingh (Muktagacha)", districtBn: "ময়মনসিংহ", districtEn: "Mymensingh", category: "upazila", lat: 24.7580, lng: 90.2650 },
  { nameBn: "ময়মনসিংহ (ভালুকা / সিডস্টোর)", nameEn: "Mymensingh (Bhaluka)", districtBn: "ময়মনসিংহ", districtEn: "Mymensingh", category: "upazila", lat: 24.3750, lng: 90.3780 },
  { nameBn: "জামালপুর (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Jamalpur (Central)", districtBn: "জামালপুর", districtEn: "Jamalpur", category: "district", lat: 24.9375, lng: 89.9378 },
  { nameBn: "জামালপুর (সরিষাবাড়ী / দেওয়ানগঞ্জ)", nameEn: "Jamalpur (Sarishabari)", districtBn: "জামালপুর", districtEn: "Jamalpur", category: "upazila", lat: 24.7450, lng: 89.8320 },
  { nameBn: "শেরপুর (সেন্ট্রাল বাস টার্মিনাল / নকলা)", nameEn: "Sherpur (Central)", districtBn: "শেরপুর", districtEn: "Sherpur", category: "district", lat: 25.0204, lng: 90.0153 },
  { nameBn: "নেত্রকোণা (সেন্ট্রাল বাসস্ট্যান্ড)", nameEn: "Netrokona (Central)", districtBn: "নেত্রকোণা", districtEn: "Netrokona", category: "district", lat: 24.8837, lng: 90.7277 },

  // Chattogram Division Other Districts
  { nameBn: "কুমিল্লা (শাসনগাছা / পদুয়ার বাজার বিশ্বরোড)", nameEn: "Cumilla (Paduar Bazar/Shasongacha)", districtBn: "কুমিল্লা", districtEn: "Cumilla", category: "district", lat: 23.4607, lng: 91.1809 },
  { nameBn: "কুমিল্লা (চান্দিনা / দাউদকান্দি)", nameEn: "Cumilla (Chandina/Daudkandi)", districtBn: "কুমিল্লা", districtEn: "Cumilla", category: "upazila", lat: 23.5350, lng: 90.7180 },
  { nameBn: "ব্রাহ্মণবাড়িয়া (সেন্ট্রাল বাসস্ট্যান্ড / সরাইল বিশ্বরোড)", nameEn: "Brahmanbaria (Sarail)", districtBn: "ব্রাহ্মণবাড়িয়া", districtEn: "Brahmanbaria", category: "district", lat: 24.0150, lng: 91.1250 },
  { nameBn: "চাঁদপুর (সেন্ট্রাল বাসস্ট্যান্ড / বাবুরহাট)", nameEn: "Chandpur (Central)", districtBn: "চাঁদপুর", districtEn: "Chandpur", category: "district", lat: 23.2321, lng: 90.6631 },
  { nameBn: "নোয়াখালী (মাইজদী সেন্ট্রাল টার্মিনাল / চৌমুহনী)", nameEn: "Noakhali (Maijdee/Chowmuhani)", districtBn: "নোয়াখালী", districtEn: "Noakhali", category: "district", lat: 22.8696, lng: 91.0994 },
  { nameBn: "ফেনী (মহিপাল হাইওয়ে বাসস্ট্যান্ড)", nameEn: "Feni (Mohipal)", districtBn: "ফেনী", districtEn: "Feni", category: "stand", lat: 23.0186, lng: 91.3966 },
  { nameBn: "লক্ষ্মীপুর (সেন্ট্রাল বাসস্ট্যান্ড / রায়পুর)", nameEn: "Lakshmipur (Central)", districtBn: "লক্ষ্মীপুর", districtEn: "Lakshmipur", category: "district", lat: 22.9447, lng: 90.8298 },
  { nameBn: "রাঙ্গামাটি (সেন্ট্রাল টার্মিনাল / তবলছড়ি)", nameEn: "Rangamati (Central)", districtBn: "রাঙ্গামাটি", districtEn: "Rangamati", category: "district", lat: 22.6533, lng: 92.1753 },
  { nameBn: "খাগড়াছড়ি (সেন্ট্রাল টার্মিনাল / সাজেক ভ্যালি)", nameEn: "Khagrachhari (Central/Sajek)", districtBn: "খাগড়াছড়ি", districtEn: "Khagrachhari", category: "district", lat: 23.1193, lng: 91.9847 },
  { nameBn: "বান্দরবান (সেন্ট্রাল বাসস্ট্যান্ড / রুমা)", nameEn: "Bandarban (Central)", districtBn: "বান্দরবান", districtEn: "Bandarban", category: "district", lat: 22.1953, lng: 92.2184 },

  // Dhaka Division Other Districts
  { nameBn: "টাঙ্গাইল (নতুন বাসস্ট্যান্ড / এলেঙ্গা)", nameEn: "Tangail (New Bus Stand/Elenga)", districtBn: "টাঙ্গাইল", districtEn: "Tangail", category: "district", lat: 24.2513, lng: 89.9167 },
  { nameBn: "টাঙ্গাইল (মির্জাপুর / গোড়াই)", nameEn: "Tangail (Mirzapur/Gorai)", districtBn: "টাঙ্গাইল", districtEn: "Tangail", category: "upazila", lat: 24.1020, lng: 90.1000 },
  { nameBn: "টাঙ্গাইল (ঘাটাইল / মধুপুর)", nameEn: "Tangail (Ghatail/Madhupur)", districtBn: "টাঙ্গাইল", districtEn: "Tangail", category: "upazila", lat: 24.6150, lng: 90.0250 },
  { nameBn: "ফরিদপুর (নতুন বাসস্ট্যান্ড / ভাঙ্গা মোড়)", nameEn: "Faridpur (Bhanga Mor)", districtBn: "ফরিদপুর", districtEn: "Faridpur", category: "district", lat: 23.6071, lng: 89.8429 },
  { nameBn: "গোপালগঞ্জ (সেন্ট্রাল টার্মিনাল / টুঙ্গিপাড়া)", nameEn: "Gopalganj (Central)", districtBn: "গোপালগঞ্জ", districtEn: "Gopalganj", category: "district", lat: 23.0051, lng: 89.8266 },
  { nameBn: "মাদারীপুর (সেন্ট্রাল বাস টার্মিনাল)", nameEn: "Madaripur (Central)", districtBn: "মাদারীপুর", districtEn: "Madaripur", category: "district", lat: 23.1641, lng: 90.1897 },
  { nameBn: "শরীয়তপুর (সেন্ট্রাল বাস টার্মিনাল / জাজিরা)", nameEn: "Shariatpur (Central/Jajira)", districtBn: "শরীয়তপুর", districtEn: "Shariatpur", category: "district", lat: 23.2423, lng: 90.4348 },
  { nameBn: "রাজবাড়ী (সেন্ট্রাল টার্মিনাল / গোয়ালন্দ ঘাট)", nameEn: "Rajbari (Central/Daulatdia)", districtBn: "রাজবাড়ী", districtEn: "Rajbari", category: "district", lat: 23.7574, lng: 89.6445 },
  { nameBn: "কিশোরগঞ্জ (গাইটাল কেন্দ্রীয় বাস টার্মিনাল / ভৈরব)", nameEn: "Kishoreganj (Gaital/Bhairab)", districtBn: "কিশোরগঞ্জ", districtEn: "Kishoreganj", category: "district", lat: 24.4449, lng: 90.7766 }
];

export function searchPlaceLocations(query: string, limit: number = 8): PlaceLocation[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  return BD_ALL_PLACES.filter(
    (p) =>
      p.nameBn.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.districtBn.toLowerCase().includes(q) ||
      p.districtEn.toLowerCase().includes(q)
  ).slice(0, limit);
}
