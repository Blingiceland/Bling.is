import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from "../context/LanguageContext";
import VenuePage from '../components/VenuePage';
import { Trash2, Plus, Upload, X, Check, XCircle, MapPin, Loader2, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { ICELAND_REGIONS } from '../constants/locations';
import { toast } from 'sonner';

// --- Sub-components (Defined OUTSIDE to prevent re-mount/focus loss) ---

// --- Reusable Components ---

const DynamicListInput = ({ items = [], onAdd, onRemove, placeholder, label }) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-2 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
                />
                <button
                    onClick={handleAdd}
                    type="button"
                    className="px-4 py-2 bg-[#ffd700]/20 text-[#ffd700] rounded-xl hover:bg-[#ffd700]/30 transition-colors"
                >
                    + Add
                </button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <span key={index} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200 border border-white/5">
                            {item}
                            <button
                                onClick={() => onRemove(index)}
                                type="button"
                                className="hover:text-red-400 ml-1"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

const VenueTypeCard = ({ label, desc, image, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`relative group cursor-pointer p-8 rounded-2xl border transition-all duration-300 overflow-hidden h-full flex flex-col items-center justify-center ${selected
            ? 'bg-[#ffd700]/10 border-[#ffd700] shadow-[0_0_30px_rgba(255,215,0,0.1)] scale-[1.02]'
            : 'bg-white/5 border-white/10 hover:border-[#ffd700]/50 hover:bg-white/10 hover:scale-[1.02]'
            }`}
    >
        <div className={`absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 to-transparent opacity-0 transition-opacity duration-500 ${selected ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>

        <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`relative mb-6 transform transition-transform duration-300 group-hover:scale-110 ${selected ? 'scale-110' : ''}`}>
                <div className={`absolute inset-0 bg-[#ffd700] rounded-full blur-xl opacity-20 transition-opacity duration-300 ${selected ? 'opacity-40' : 'group-hover:opacity-30'}`}></div>
                <img
                    src={image}
                    alt={label}
                    className="relative w-32 h-32 object-contain drop-shadow-2xl"
                />
            </div>
            <span className={`text-xl font-bold mb-2 transition-colors ${selected ? 'text-[#ffd700]' : 'text-white'}`}>{label}</span>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</span>
        </div>
    </div>
);

const Step1_Type = ({ formData, updateForm }) => {
    const { language } = useLanguage();

    return (
        <div className="animate-fade-in w-full max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {window.location.pathname.includes('edit')
                    ? (language === 'en' ? 'Review & Edit Venue Type' : 'Skoða og Breyta Tegund')
                    : (language === 'en' ? 'What kind of events do you host?' : 'Hvers konar viðburði hýsir þú?')}
            </h2>
            <p className="text-gray-400 text-center mb-12 text-lg">
                {window.location.pathname.includes('edit')
                    ? (language === 'en' ? 'Update the category if needed.' : 'Uppfærðu flokkinn ef þarf.')
                    : (language === 'en' ? 'Select the option that best describes your venue' : 'Veldu þann valmöguleika sem lýsir staðnum þínum best')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <VenueTypeCard
                    label={language === 'en' ? "Public Gigs" : "Opinberir Viðburðir"}
                    desc={language === 'en' ? "Concerts, Comedy, Ticketed Events" : "Tónleikar, Uppistand, Miðasala"}
                    image="/images/button1.png"
                    selected={formData.venueType === 'public'}
                    onClick={() => updateForm('venueType', 'public')}
                />
                <VenueTypeCard
                    label={language === 'en' ? "Private Events" : "Einkaviðburðir"}
                    desc={language === 'en' ? "Weddings, Parties, Corporate" : "Brúðkaup, Veislur, Fyrirtæki"}
                    image="/images/button2.png"
                    selected={formData.venueType === 'private'}
                    onClick={() => updateForm('venueType', 'private')}
                />
                <VenueTypeCard
                    label={language === 'en' ? "Both" : "Bæði"}
                    desc={language === 'en' ? "We do it all!" : "Við gerum allt!"}
                    image="/images/button3.png"
                    selected={formData.venueType === 'both'}
                    onClick={() => updateForm('venueType', 'both')}
                />
            </div>

            <div className="mt-16 animate-fade-in-up">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">
                    {language === 'en' ? 'Specific Venue Categories' : 'Sérstakir Flokkar'}
                </h3>
                <p className="text-gray-400 text-center mb-8">
                    {language === 'en' ? 'Select all that apply to your space' : 'Veldu allt sem viðkemur þínu rými'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Live Venue', 'Nightclub', 'Bar / Pub', 'Restaurant', 'Banquet Hall', 'Conference Hall', 'Cafe', 'Hotel', 'Outdoor Area', 'Cultural Center'].map(type => {
                        let label = type;
                        if (language !== 'en') {
                            const map = {
                                'Live Venue': 'Tónleikastaður',
                                'Nightclub': 'Skemmtistaður',
                                'Bar / Pub': 'Bar / Krá',
                                'Restaurant': 'Veitingastaður',
                                'Banquet Hall': 'Veislusalur',
                                'Conference Hall': 'Ráðstefnusalur',
                                'Cafe': 'Kaffihús',
                                'Hotel': 'Hótel',
                                'Outdoor Area': 'Útisvæði',
                                'Cultural Center': 'Menningarhús'
                            };
                            label = map[type] || type;
                        }

                        return (
                            <label key={type} className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${(formData.venueSubTypes || []).includes(type)
                                ? 'bg-[#ffd700]/10 border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                                }`}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${(formData.venueSubTypes || []).includes(type) ? 'bg-[#ffd700] border-[#ffd700]' : 'border-gray-500'
                                    }`}>
                                    {(formData.venueSubTypes || []).includes(type) && <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={(formData.venueSubTypes || []).includes(type)}
                                    onChange={(e) => {
                                        const current = formData.venueSubTypes || [];
                                        let updated;
                                        if (e.target.checked) {
                                            updated = [...current, type];
                                        } else {
                                            updated = current.filter(t => t !== type);
                                        }
                                        updateForm('venueSubTypes', updated);
                                    }}
                                />
                                <span className={`text-sm font-bold ${(formData.venueSubTypes || []).includes(type) ? 'text-white' : 'text-gray-300'}`}>{label}</span>
                            </label>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

const Step2_Gig = ({ formData, updateForm }) => (
    <div className="animate-fade-in w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Public Gig Details</h2>
            <p className="text-gray-400">Tell artists exactly what to expect at your venue.</p>
        </div>

        {/* 1. Capacity & Layout */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span> Capacity & Layout
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Seated Capacity</label>
                    <input
                        type="number"
                        value={formData.capacitySeated}
                        onChange={e => updateForm('capacitySeated', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                        placeholder="0"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Standing Capacity</label>
                    <input
                        type="number"
                        value={formData.capacityStanding}
                        onChange={e => updateForm('capacityStanding', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                        placeholder="0"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Room Layout Type</label>
                    <select
                        value={formData.layoutType}
                        onChange={e => updateForm('layoutType', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                    >
                        <option value="">Select Layout...</option>
                        <option value="theater">Theater (Rows of seats)</option>
                        <option value="cabaret">Cabaret (Tables & Chairs)</option>
                        <option value="club">Club (Mostly Standing)</option>
                        <option value="mixed">Mixed (Seated & Standing)</option>
                    </select>
                </div>
            </div>
        </div>

        {/* 2. Stage Details */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">🎭</span> Stage Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Width (m)</label>
                    <input type="text" value={formData.stageWidth} onChange={e => updateForm('stageWidth', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. 6m" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Depth (m)</label>
                    <input type="text" value={formData.stageDepth} onChange={e => updateForm('stageDepth', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. 4m" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Height (m)</label>
                    <input type="text" value={formData.stageHeight} onChange={e => updateForm('stageHeight', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. 0.5m" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Power Outlets on Stage</label>
                <input type="number" value={formData.stagePower} onChange={e => updateForm('stagePower', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="Number of outlets" />
            </div>
        </div>

        {/* 3. Sound & Tech */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">🔊</span> Sound & Tech
            </h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">PA System Description</label>
                    <textarea value={formData.paDescription} onChange={e => updateForm('paDescription', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="Brand, wattage, subwoofers..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Mixing Console</label>
                        <input type="text" value={formData.mixingConsole} onChange={e => updateForm('mixingConsole', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. Behringer X32" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Lighting Rig</label>
                        <input type="text" value={formData.lightingInfo} onChange={e => updateForm('lightingInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. Basic Wash, LED Spots" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Microphones Available</label>
                        <input type="text" value={formData.micsInfo} onChange={e => updateForm('micsInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="Count & Type (e.g. 4x SM58)" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Monitors Available</label>
                        <input type="text" value={formData.monitorsInfo} onChange={e => updateForm('monitorsInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="Count & Type" />
                    </div>
                </div>
                <div className="form-group checkbox-row mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.soundEngineer}
                            onChange={(e) => updateForm('soundEngineer', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-[#ffd700] focus:ring-[#ffd700]"
                        />
                        <span className="text-white">In-house Sound Engineer available?</span>
                    </label>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                    <DynamicListInput
                        label="Other Tech Specs"
                        placeholder="e.g. 3-Phase Power, Hazer..."
                        items={formData.customTech || []}
                        onAdd={(item) => updateForm('customTech', [...(formData.customTech || []), item])}
                        onRemove={(index) => updateForm('customTech', formData.customTech.filter((_, i) => i !== index))}
                    />
                </div>
            </div>
        </div>

        {/* 4. Artist Hospitality */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">🥂</span> Artist Hospitality
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/10 hover:bg-white/5">
                    <input type="checkbox" checked={formData.greenRoom} onChange={e => updateForm('greenRoom', e.target.checked)} />
                    <span className="text-white">Green Room Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/10 hover:bg-white/5">
                    <input type="checkbox" checked={formData.shower} onChange={e => updateForm('shower', e.target.checked)} />
                    <span className="text-white">Private Restroom/Shower</span>
                </label>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Artist Food & Drink Policy</label>
                    <textarea value={formData.artistFoodPolicy} onChange={e => updateForm('artistFoodPolicy', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. 20% off menu, 2 free drinks per member..." />
                </div>
                <DynamicListInput
                    label="Other Hospitality"
                    placeholder="e.g. Towels provided, Laundry..."
                    items={formData.customHospitality || []}
                    onAdd={(item) => updateForm('customHospitality', [...(formData.customHospitality || []), item])}
                    onRemove={(index) => updateForm('customHospitality', formData.customHospitality.filter((_, i) => i !== index))}
                />
            </div>
        </div>

        {/* 5. Logistics */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">🚚</span> Logistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Load-in Information</label>
                    <input type="text" value={formData.loadInInfo} onChange={e => updateForm('loadInInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. Ground floor, back alley access" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Artist Parking</label>
                    <input type="text" value={formData.parkingInfo} onChange={e => updateForm('parkingInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. 2 spots in back lot" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.doorStaff}
                            onChange={(e) => updateForm('doorStaff', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-[#ffd700] focus:ring-[#ffd700]"
                        />
                        <span className="text-white">Can you provide staff to help sell entry at the door?</span>
                    </label>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.posAvailable}
                            onChange={(e) => updateForm('posAvailable', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-[#ffd700] focus:ring-[#ffd700]"
                        />
                        <span className="text-white">Can you provide a POS system for entry fees?</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
);

const Step3_Private = ({ formData, updateForm, updateAmenity }) => (
    <div className="animate-fade-in w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Private Event Details</h2>
            <p className="text-gray-400">Help clients plan their perfect event.</p>
        </div>

        {/* 1. Event Suitability */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">🎉</span> Event Suitability
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Weddings', 'Corporate', 'Parties', 'Conferences'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/10 hover:bg-white/5">
                        <input
                            type="checkbox"
                            checked={formData.eventSuitability?.[type] || false}
                            onChange={(e) => {
                                const newSuitability = { ...formData.eventSuitability, [type]: e.target.checked };
                                updateForm('eventSuitability', newSuitability);
                            }}
                            className="w-4 h-4 rounded border-gray-500 text-[#ffd700] focus:ring-[#ffd700]"
                        />
                        <span className="text-white text-sm">{type}</span>
                    </label>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Seated Capacity</label>
                    <input type="number" value={formData.privateCapacitySeated} onChange={e => updateForm('privateCapacitySeated', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="0" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Standing Capacity</label>
                    <input type="number" value={formData.privateCapacityStanding} onChange={e => updateForm('privateCapacityStanding', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="0" />
                </div>
            </div>
        </div>

        {/* 2. Catering & Alcohol */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">🍽️</span> Catering & Drinks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.inHouseCatering} onChange={e => updateForm('inHouseCatering', e.target.checked)} className="w-5 h-5 rounded border-gray-500 text-[#ffd700]" />
                    <span className="text-white">In-house Catering Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.externalCatering} onChange={e => updateForm('externalCatering', e.target.checked)} className="w-5 h-5 rounded border-gray-500 text-[#ffd700]" />
                    <span className="text-white">External Catering Allowed</span>
                </label>
            </div>
            {formData.externalCatering && (
                <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.kitchenAccess} onChange={e => updateForm('kitchenAccess', e.target.checked)} className="w-5 h-5 rounded border-gray-500 text-[#ffd700]" />
                        <span className="text-white text-sm">Kitchen Access for Caterers?</span>
                    </label>
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Alcohol Policy</label>
                <select value={formData.alcoholPolicy} onChange={e => updateForm('alcoholPolicy', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white">
                    <option value="">Select Policy...</option>
                    <option value="venue_only">Venue Bar Only</option>
                    <option value="byob">BYOB Allowed</option>
                    <option value="corkage">BYOB with Corkage Fee</option>
                </select>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
                <DynamicListInput
                    label="Other Catering/Drink Options"
                    placeholder="e.g. Vegan Menu, Halal Certified..."
                    items={formData.customCatering || []}
                    onAdd={(item) => updateForm('customCatering', [...(formData.customCatering || []), item])}
                    onRemove={(index) => updateForm('customCatering', formData.customCatering.filter((_, i) => i !== index))}
                />
            </div>
        </div>

        {/* 3. Staff & Services */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">👔</span> Staff & Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.eventCoordinator} onChange={e => updateForm('eventCoordinator', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Event Coordinator</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.securityAvailable} onChange={e => updateForm('securityAvailable', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Security Personnel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.cleaningIncluded} onChange={e => updateForm('cleaningIncluded', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Cleaning Included</span>
                </label>
            </div>
            <DynamicListInput
                label="Other Staff Services"
                placeholder="e.g. Coat Check, Valet..."
                items={formData.customStaff || []}
                onAdd={(item) => updateForm('customStaff', [...(formData.customStaff || []), item])}
                onRemove={(index) => updateForm('customStaff', formData.customStaff.filter((_, i) => i !== index))}
            />
        </div>

        {/* 4. Tech & AV */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">📽️</span> Tech & AV
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Projectors / Screens</label>
                    <input type="text" value={formData.projectorsInfo} onChange={e => updateForm('projectorsInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="Count & Type" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Microphones for Speeches</label>
                    <input type="text" value={formData.speechMicsInfo} onChange={e => updateForm('speechMicsInfo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white" placeholder="e.g. 2 Wireless Handhelds" />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer mt-8">
                        <input type="checkbox" checked={formData.liveStreaming} onChange={e => updateForm('liveStreaming', e.target.checked)} className="w-5 h-5 rounded border-gray-500 text-[#ffd700]" />
                        <span className="text-white">Live Streaming Capable?</span>
                    </label>
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer mt-8">
                        <input type="checkbox" checked={formData.djSetup} onChange={e => updateForm('djSetup', e.target.checked)} className="w-5 h-5 rounded border-gray-500 text-[#ffd700]" />
                        <span className="text-white">Dedicated DJ Setup Area?</span>
                    </label>
                </div>
            </div>
            <DynamicListInput
                label="Other AV Options"
                placeholder="e.g. LED Wall, Podium..."
                items={formData.customPrivateTech || []}
                onAdd={(item) => updateForm('customPrivateTech', [...(formData.customPrivateTech || []), item])}
                onRemove={(index) => updateForm('customPrivateTech', formData.customPrivateTech.filter((_, i) => i !== index))}
            />
        </div>

        {/* 5. Amenities */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span> Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.furnitureIncluded} onChange={e => updateForm('furnitureIncluded', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Furniture (Tables/Chairs)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.linensIncluded} onChange={e => updateForm('linensIncluded', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Linens Provided</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.outdoorSpace} onChange={e => updateForm('outdoorSpace', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Outdoor Space</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/10 rounded-lg">
                    <input type="checkbox" checked={formData.wheelchairAccess} onChange={e => updateForm('wheelchairAccess', e.target.checked)} className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white text-sm">Wheelchair Accessible</span>
                </label>
            </div>
            <DynamicListInput
                label="Other Amenities"
                placeholder="e.g. Photo Booth, Kids Play Area..."
                items={formData.customAmenities || []}
                onAdd={(item) => updateForm('customAmenities', [...(formData.customAmenities || []), item])}
                onRemove={(index) => updateForm('customAmenities', formData.customAmenities.filter((_, i) => i !== index))}
            />
        </div>
    </div>
);

const Step4_General = ({ formData, updateForm, handleLogoUpload }) => (
    <div className="animate-fade-in w-full max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Final Touches</h2>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Venue Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="e.g. The Blue Note"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">City / Location</label>
                <select
                    value={formData.city}
                    onChange={e => updateForm('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50 appearance-none"
                    required
                >
                    <option value="" className="text-black">Select Municipality</option>
                    {ICELAND_REGIONS.map(region => (
                        <optgroup key={region.name} label={region.name} className="text-black font-bold">
                            {region.cities.map(city => (
                                <option key={city} value={city} className="text-black font-normal">
                                    {city}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Address</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={e => updateForm('address', e.target.value)}
                    placeholder="e.g. Laugavegur 12"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Phone Number</label>
            <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={e => updateForm('phoneNumber', e.target.value)}
                placeholder="e.g. +354 123 4567"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
            />
        </div>

        {formData.venueType === 'public' && (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">General Capacity</label>
                <input
                    type="number"
                    value={formData.capacity}
                    onChange={e => updateForm('capacity', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                />
            </div>
        )}

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Short Description</label>
            <textarea
                value={formData.description}
                onChange={e => updateForm('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Logo / Photo</label>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                {formData.logoUrl && (
                    <img src={formData.logoUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ffd700]/10 file:text-[#ffd700] hover:file:bg-[#ffd700]/20"
                />
            </div>
            <p className="text-xs text-gray-500">Upload a small image to be used on your landing site.</p>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Anything else?</label>
            <textarea
                value={formData.anythingElse}
                onChange={e => updateForm('anythingElse', e.target.value)}
                placeholder="Parking info, access codes, etc."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
            />
        </div>
    </div>
);


// --- Review & Summary Screen ---
// --- Review & Summary Screen ---
const Step5_Review = ({ formData, setStep, updateForm, currentUser }) => {
    // Admin Check
    const isAdmin = currentUser && (currentUser.email.includes('@bling.is') || currentUser.email === 'jonbs@bling.is');

    // Helper to jump to edit a section
    const EditBtn = ({ stepNum }) => (
        <button
            onClick={() => setStep(stepNum)}
            className="ml-4 text-xs bg-white/10 hover:bg-white/20 text-[#ffd700] px-2 py-1 rounded transition-colors"
            title="Edit this section"
        >
            ✎ Edit
        </button>
    );

    const Section = ({ title, children, editStep }) => (
        <div className="glass-card p-6 rounded-xl border border-white/10 mb-6 relative group">
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                {title}
                {editStep && <EditBtn stepNum={editStep} />}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const Row = ({ label, value }) => {
        if (!value) return null;
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="text-white md:col-span-2 break-words">{value}</span>
            </div>
        );
    };

    const BoolRow = ({ label, value }) => (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${value ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
            {value ? <span>✔</span> : <span>✖</span>}
            <span className={value ? "text-white font-medium" : "text-gray-500"}>{label}</span>
        </div>
    );

    const Grid = ({ children }) => <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{children}</div>;
    const SubHeader = ({ title }) => <h4 className="text-white font-bold mt-4 mb-2 uppercase text-xs tracking-wider border-l-2 border-[#ffd700] pl-2">{title}</h4>;

    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Review Application</h2>

                <button
                    onClick={() => setStep('PREVIEW')}
                    className="flex items-center gap-2 text-[#ffd700] hover:underline"
                >
                    Preview Live Page <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            {/* ADMIN ONLY: Status Override */}
            {isAdmin && (
                <div className="glass-card p-6 rounded-xl border border-[#ffd700]/50 bg-[#ffd700]/5 mb-8">
                    <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                        👑 Admin Controls
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <label className="text-white font-medium">Venue Status:</label>
                        <select
                            value={formData.status || 'pending'}
                            onChange={(e) => updateForm('status', e.target.value)}
                            className="bg-black border border-white/20 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ffd700]"
                        >
                            <option value="pending">🟡 Pending</option>
                            <option value="approved">🟢 Approved</option>
                            <option value="rejected">🔴 Rejected</option>
                        </select>
                        <p className="text-xs text-gray-400 md:col-span-2">
                            Select status and click "Update Venue Profile" below to apply.
                        </p>
                    </div>
                </div>
            )}

            <Section title="General & Logistics" editStep={4}>
                <div className="flex items-start gap-6 mb-6">
                    {formData.logoUrl && (
                        <img src={formData.logoUrl} alt="Logo" className="w-24 h-24 rounded-full object-cover border border-white/20" />
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                        <p className="text-gray-400">{formData.address}, {formData.city}</p>
                        <p className="text-[#ffd700] font-bold mt-1">{formData.venueType === 'both' ? 'Public & Private' : formData.venueType}</p>
                    </div>
                </div>
                <Row label="Description" value={formData.description} />
                <Row label="Phone" value={formData.phoneNumber} />
                <Row label="Total Capacity" value={formData.capacity} />

                <SubHeader title="Logistics & Access" />
                <Row label="Parking" value={formData.parkingInfo} />
                <Row label="Load-in" value={formData.loadInInfo} />
                <Grid>
                    <BoolRow label="Wheelchair Access" value={formData.wheelchairAccess} />
                    <BoolRow label="Outdoor Space" value={formData.outdoorSpace} />
                </Grid>
                <Row label="Additional Notes" value={formData.anythingElse} />
            </Section>

            {(formData.venueType === 'public' || formData.venueType === 'both') && (
                <Section title="Public Gig Details" editStep={2}>
                    <Grid>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                            <span className="block text-gray-400 text-xs uppercase">Seated</span>
                            <span className="text-xl font-bold text-white">{formData.capacitySeated || '-'}</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                            <span className="block text-gray-400 text-xs uppercase">Standing</span>
                            <span className="text-xl font-bold text-white">{formData.capacityStanding || '-'}</span>
                        </div>
                    </Grid>

                    <SubHeader title="Technical Specs" />
                    <Row label="Stage Dimensions" value={`${formData.stageWidth} x ${formData.stageDepth} x ${formData.stageHeight}`} />
                    <Row label="PA System" value={formData.paDescription} />
                    <Row label="Mixing Console" value={formData.mixingConsole} />
                    <Row label="Microphones" value={formData.micsInfo} />
                    <Row label="Monitors" value={formData.monitorsInfo} />
                    <Row label="Lighting" value={formData.lightingInfo} />
                    <Row label="Stage Power" value={formData.stagePower} />

                    <SubHeader title="Staff & Services" />
                    <Grid>
                        <BoolRow label="Sound Engineer" value={formData.soundEngineer} />
                        <BoolRow label="Door Staff" value={formData.doorStaff} />
                        <BoolRow label="POS System" value={formData.posAvailable} />
                        <BoolRow label="Backline" value={formData.backlineAvailable} />
                    </Grid>

                    <SubHeader title="Hospitality" />
                    <Row label="Food Policy" value={formData.artistFoodPolicy} />
                    <Grid>
                        <BoolRow label="Green Room" value={formData.greenRoom} />
                        <BoolRow label="Shower" value={formData.shower} />
                    </Grid>
                </Section>
            )}

            {(formData.venueType === 'private' || formData.venueType === 'both') && (
                <Section title="Private Event Details" editStep={3}>
                    <Grid>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                            <span className="block text-gray-400 text-xs uppercase">Seated</span>
                            <span className="text-xl font-bold text-white">{formData.privateCapacitySeated || '-'}</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                            <span className="block text-gray-400 text-xs uppercase">Standing</span>
                            <span className="text-xl font-bold text-white">{formData.privateCapacityStanding || '-'}</span>
                        </div>
                    </Grid>

                    <SubHeader title="Suitability" />
                    <Grid>
                        {Object.entries(formData.eventSuitability || {}).map(([key, val]) => (
                            <BoolRow key={key} label={key} value={val} />
                        ))}
                    </Grid>

                    <SubHeader title="Catering & Service" />
                    <Row label="Alcohol Policy" value={formData.alcoholPolicy} />
                    <Grid>
                        <BoolRow label="In-house Catering" value={formData.inHouseCatering} />
                        <BoolRow label="External Catering" value={formData.externalCatering} />
                        <BoolRow label="Kitchen Access" value={formData.kitchenAccess} />
                        <BoolRow label="Furniture" value={formData.furnitureIncluded} />
                        <BoolRow label="Linens" value={formData.linensIncluded} />
                        <BoolRow label="Event Coordinator" value={formData.eventCoordinator} />
                        <BoolRow label="Security" value={formData.securityAvailable} />
                        <BoolRow label="Cleaning" value={formData.cleaningIncluded} />
                    </Grid>

                    <SubHeader title="Tech & AV" />
                    <Row label="Projectors" value={formData.projectorsInfo} />
                    <Row label="Mics" value={formData.speechMicsInfo} />
                    <Grid>
                        <BoolRow label="Live Streaming" value={formData.liveStreaming} />
                        <BoolRow label="DJ Setup" value={formData.djSetup} />
                    </Grid>

                    <SubHeader title="Amenities" />
                    <Grid>
                        {Object.entries(formData.amenities || {}).map(([key, val]) => (
                            <BoolRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
                        ))}
                    </Grid>
                </Section>
            )}
        </div>
    );
};

const SubmissionSuccess = () => (
    <div className="animate-fade-in text-center py-12 px-4">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold mb-4 text-white">
            {window.location.pathname.includes('edit') ? 'Venue Updated!' : 'Application Received!'}
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
            {window.location.pathname.includes('edit')
                ? 'Your venue profile has been successfully updated.'
                : 'Thank you for submitting your venue details. We will be in touch shortly.'
            }
        </p>
        <Link to="/" className="inline-block py-4 px-8 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 transition-all duration-300">
            Back to Home
        </Link>
    </div>
);

// --- Main Component ---

const CreateVenue = () => {
    const { currentUser, verifyEmail } = useAuth();
    const navigate = useNavigate();
    const { id: editVenueId } = useParams(); // Check if we are in edit mode
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    // Verification gate moved below hooks to fix React Hook Rule violation



    // Initial State
    const [formData, setFormData] = useState({
        // Step 1: Type
        venueType: '', // 'public', 'private', 'both'
        venueSubTypes: [], // ['Live Venue', 'Bar', etc.]

        // Step 2: Gig Details (Expanded)
        capacitySeated: '',
        capacityStanding: '',
        layoutType: '', // theater, cabaret, etc.
        stageWidth: '',
        stageDepth: '',
        stageHeight: '',
        stagePower: '',
        paDescription: '',
        mixingConsole: '',
        micsInfo: '',
        monitorsInfo: '',
        lightingInfo: '',
        soundEngineer: false,
        backlineAvailable: false, // Keeping for backward compatibility or extra note
        doorStaff: false, // Replaced 'ticketed'
        posAvailable: false,

        // Hospitality
        greenRoom: false,
        shower: false,
        artistFoodPolicy: '',

        // Logistics
        loadInInfo: '',
        parkingInfo: '',

        // Step 3: Private Details (Expanded)
        amenities: { // Legacy or can be kept for quick toggles
            wifi: false,
            projector: false,
            kitchen: false,
            soundSystem: false,
            stage: false,
            karaoke: false
        },
        privateCapacitySeated: '',
        privateCapacityStanding: '',

        eventSuitability: {
            Weddings: false,
            Corporate: false,
            Parties: false,
            Conferences: false
        },

        // Catering
        inHouseCatering: false,
        externalCatering: false,
        kitchenAccess: false,
        alcoholPolicy: '',

        // Staff
        eventCoordinator: false,
        securityAvailable: false,
        cleaningIncluded: false,

        // Tech
        projectorsInfo: '',
        speechMicsInfo: '',
        liveStreaming: false,
        djSetup: false,

        // Amenities
        furnitureIncluded: false,
        linensIncluded: false,
        outdoorSpace: false,
        wheelchairAccess: false,

        // Amenities
        furnitureIncluded: false,
        linensIncluded: false,
        outdoorSpace: false,
        wheelchairAccess: false,

        // Custom Dynamic Fields
        customTech: [], // Public Gig
        customHospitality: [], // Public Gig
        customCatering: [], // Private
        customStaff: [], // Private
        customPrivateTech: [], // Private
        customAmenities: [], // Private

        // Step 4: General Info
        name: '',
        city: '',
        address: '',
        phoneNumber: '',
        description: '',
        logoUrl: '',
        capacity: '', // General capacity if not private
        anythingElse: ''
    });

    // --- Edit Mode: Fetch Data ---
    React.useEffect(() => {
        const fetchVenueData = async () => {
            if (!editVenueId) return;

            setLoading(true);
            try {
                const docRef = doc(db, "venues", editVenueId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Fetched Venue Data:", data); // Debugging
                    setFormData(prev => ({ ...prev, ...data }));

                    // Auto-jump to Review (Step 5) for instant access
                    setStep(5);
                } else {
                    toast.error("Venue not found");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error fetching venue:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVenueData();
    }, [editVenueId, navigate]);

    // --- Email Verification Gate ---
    if (currentUser && !currentUser.emailVerified) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-[#ffd700]/10 rounded-full flex items-center justify-center mb-6 border border-[#ffd700]/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                    <span className="text-4xl">📧</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">Verify Your Email</h2>
                <p className="text-gray-400 mb-8 text-lg">
                    To maintain a professional community, we require all venue hosts to verify their email address.
                    <br /><br />
                    We sent a link to <span className="text-white font-semibold">{currentUser.email}</span>
                </p>

                <div className="flex flex-col gap-4 w-full">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 px-6 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-lg transition-all"
                    >
                        I've Verified (Refresh Page)
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await verifyEmail();
                                setVerificationSent(true);
                                toast.success("Verification email sent!");
                            } catch (e) {
                                toast.error(e.message);
                            }
                        }}
                        disabled={verificationSent}
                        className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all disabled:opacity-50"
                    >
                        {verificationSent ? 'Link Sent!' : 'Resend Verification Link'}
                    </button>
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    Wrong email? <Link to="/login" className="text-[#ffd700] hover:underline">Sign out</Link>
                </p>
            </div>
        );
    }

    // --- Helpers ---
    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateAmenity = (key) => {
        setFormData(prev => ({
            ...prev,
            amenities: { ...prev.amenities, [key]: !prev.amenities[key] }
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB Limit
            toast.error("Image is too large. Please choose an image under 1MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            updateForm('logoUrl', reader.result);
        };
        reader.readAsDataURL(file);
    };

    // --- Navigation Logic ---
    const nextStep = () => {
        if (step === 1) {
            if (!formData.venueType) return toast.error("Please select a venue type.");
            if (formData.venueType === 'private') return setStep(3); // Skip Gig
        }
        if (step === 2) {
            if (formData.venueType === 'public') return setStep(4); // Skip Private
        }
        // Go to Review (Step 5) instead of submitting immediately if not already there
        // Actually, let's make Step 4 -> Step 5
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (step === 3 && formData.venueType === 'private') return setStep(1); // Back to Type
        if (step === 4 && formData.venueType === 'public') return setStep(2); // Back to Gig
        setStep(prev => prev - 1);
    };

    // --- Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editVenueId) {
                // --- UPDATE EXISTING ---
                await updateDoc(doc(db, "venues", editVenueId), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                setSubmitted(true);
                toast.success('Venue updated successfully!');
            } else {
                // --- CREATE NEW ---
                const docRef = await addDoc(collection(db, "venues"), {
                    ...formData,
                    ownerId: currentUser.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    status: 'pending',
                    region: 'IS',
                    currency: "ISK",
                    sheetUrl: "",
                });

                // Factory Call (Only for new venues)
                fetch("https://script.google.com/macros/s/AKfycbyXfqRdUb7clfycdlzSXZ8z44CPBX2JnNteMmXNCLvLhNMKhRpcrOjSwKt4xdsqIJoO/exec", {
                    method: 'POST',
                    body: JSON.stringify({ venueName: formData.name }),
                    headers: { "Content-Type": "text/plain" }
                }).then(async (factoryRes) => {
                    const data = await factoryRes.json();
                    if (data.status === 'success') {
                        await updateDoc(doc(db, "venues", docRef.id), {
                            sheetUrl: data.sheetUrl,
                            sheetId: data.sheetId
                        });
                    }
                }).catch(err => console.warn("Background factory call failed/delayed:", err));

                setSubmitted(true);
                toast.success('Venue created successfully!');
            }
        } catch (error) {
            console.error("Error submitting venue:", error);
            toast.error("Error submitting venue. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SubmissionSuccess />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Progress Bar */}
            <div className="max-w-xl mx-auto mb-12 flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-2 rounded-full flex-1 transition-all duration-500 ${step >= i ? 'bg-[#ffd700]' : 'bg-white/10'}`} />
                ))}
            </div>

            {/* Steps */}
            {step === 1 && <Step1_Type formData={formData} updateForm={updateForm} />}
            {step === 2 && <Step2_Gig formData={formData} updateForm={updateForm} />}
            {step === 3 && <Step3_Private formData={formData} updateForm={updateForm} updateAmenity={updateAmenity} />}
            {step === 4 && <Step4_General formData={formData} updateForm={updateForm} handleLogoUpload={handleLogoUpload} />}
            {step === 5 && <Step5_Review formData={formData} setStep={setStep} updateForm={updateForm} currentUser={currentUser} />}

            {/* Preview Modal Overlay */}
            {step === 'PREVIEW' && (
                <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
                    <div className="relative min-h-screen">
                        {/* Close Preview Button */}
                        <button
                            onClick={() => setStep(5)}
                            className="fixed top-6 right-6 z-[110] bg-black/50 hover:bg-black/80 text-white px-6 py-3 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <XCircle className="w-6 h-6" /> Close Preview
                        </button>

                        <VenuePage
                            venueId={editVenueId || 'new-preview'}
                            previewData={formData}
                            onBack={() => setStep(5)}
                        />
                    </div>
                </div>
            )}

            {/* Navigation Buttons (Hide in Preview) */}
            {step !== 'PREVIEW' && (
                <div className="max-w-4xl mx-auto mt-12 flex gap-4">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            disabled={loading}
                            className="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium disabled:opacity-50"
                        >
                            Back
                        </button>
                    )}

                    {step < 5 ? (
                        <button
                            onClick={nextStep}
                            className="flex-1 py-4 px-8 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Next Step →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 py-4 px-8 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                editVenueId ? 'Update Venue Profile' : 'Confirm & Submit'
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreateVenue;
