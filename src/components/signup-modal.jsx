import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signUpVenue } from "../lib/db";
import { Loader2 } from "lucide-react";

export function SignupModal({ children }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        venueName: "",
        phone: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await signUpVenue(formData);
        setLoading(false);
        setOpen(false);
        alert("Takk fyrir skráninguna! Við munum hafa samband.");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white border-white/10">
                <DialogHeader>
                    <DialogTitle>Skráðu þinn stað</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Fylltu út formið hér að neðan til að skrá þinn stað á Bling.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nafn</Label>
                        <Input id="name" name="name" placeholder="Jón Jónsson" required className="bg-white/5 border-white/10" onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Netfang</Label>
                        <Input id="email" name="email" type="email" placeholder="jon@example.com" required className="bg-white/5 border-white/10" onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="venueName">Nafn á stað</Label>
                        <Input id="venueName" name="venueName" placeholder="Barinn ehf." required className="bg-white/5 border-white/10" onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Símanúmer</Label>
                        <Input id="phone" name="phone" placeholder="123 4567" className="bg-white/5 border-white/10" onChange={handleChange} />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-[#ffd700] text-black hover:bg-[#ffd700]/90 mt-4">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Senda inn umsókn
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
