import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Leaf, Recycle, ShoppingCart, Sparkles, Star, Filter, ExternalLink, Heart, Plus, Trash2 } from "lucide-react";


const CATEGORIES = [
  "Home Energy",
  "Travel",
  "Groceries",
  "Personal Care",
  "Electronics",
];

const PRODUCTS = [
  {
    id: "p1",
    name: "LED Bulb (9W)",
    brand: "EcoBright",
    category: "Home Energy",
    aqiImpact: "Low",
    co2SavedKg: 18,
    rating: 4.6,
    price: 199,
    link: "https://www.amazon.in/s?k=9w+led+bulb",
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=1200&auto=format&fit=crop",
    badges: ["Energy Star", "BEE 5★"],
    whyBetter:
      "Uses up to 85% less power than incandescent, lasts 10x longer, reduces peak demand.",
  },
  {
    id: "p2",
    name: "Organic Cotton Tote",
    brand: "GreenWeave",
    category: "Groceries",
    aqiImpact: "Low",
    co2SavedKg: 4,
    rating: 4.4,
    price: 299,
    link: "https://www.amazon.in/s?k=cotton+tote+bag",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    badges: ["Reusable", "Plastic-Free"],
    whyBetter:
      "Avoids single-use plastics, sturdy for daily grocery runs.",
  },
  {
    id: "p3",
    name: "Bamboo Toothbrush",
    brand: "EarthCare",
    category: "Personal Care",
    aqiImpact: "Very Low",
    co2SavedKg: 1.2,
    rating: 4.2,
    price: 149,
    link: "",
    image: "https://img.freepik.com/premium-photo/eco-friendly-bamboo-toothbrushes-with-natural-background_648871-8075.jpg",
    badges: ["Biodegradable", "Plastic-Free"],
    whyBetter:
      "Compostable handle, reduces plastic waste in landfills.",
  },
  {
    id: "p4",
    name: "Metro/Bus Smart Card",
    brand: "DMRC",
    category: "Travel",
    aqiImpact: "Very Low",
    co2SavedKg: 120,
    rating: 4.8,
    price: 150,
    link: "https://www.dmrcsmartcard.com/",
    image: "https://th.bing.com/th/id/R.6df07a6bda8595fdc97d9c456dd3f2b7?rik=U3817SUQnioZ2Q&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2f8%2f83%2fMetro-Paris-Rame-MF77-ligne.jpg&ehk=Jzgixs35xpR9my7uoHcImBO1Y1uoDXz7oOfUndEELT8%3d&risl=&pid=ImgRaw&r=0",
    badges: ["Public Transit", "Low AQI Exposure"],
    whyBetter:
      "Shifts trips from private vehicles to transit, slashes per‑km emissions and exposure.",
  },
  {
    id: "p5",
    name: "Solar Power Bank",
    brand: "SunVolt",
    category: "Electronics",
    aqiImpact: "Low",
    co2SavedKg: 9,
    rating: 4.1,
    price: 1899,
    link: "https://www.amazon.in/s?k=solar+power+bank",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1200&auto=format&fit=crop",
    badges: ["Recharge via Sun", "Reusable"],
    whyBetter:
      "Charges on solar, reduces grid draw during peak fossil periods.",
  },
  {
    id: "p6",
    name: "HEPA Room Air Purifier",
    brand: "PureAir",
    category: "Home Energy",
    aqiImpact: "Exposure Guard",
    co2SavedKg: 0,
    rating: 4.5,
    price: 6999,
    link: "https://www.amazon.in/s?k=hepa+air+purifier",
    image: "https://m.media-amazon.com/images/I/71ipnrfS-1L._AC_SX208_CB1169409_QL70_.jpg",
    badges: ["HEPA 13", "PM2.5 Removal"],
    whyBetter:
      "Reduces indoor PM2.5 exposure during high-AQI days; pair with sealed rooms.",
  },
  {
    id: "p7",
    name: "Reusable Water Bottle",
    brand: "HydroFlask",
    category: "Personal Care",
    aqiImpact: "Low",
    co2SavedKg: 35,
    rating: 4.9,
    price: 899,
    link: "https://www.amazon.in/s?k=metal+water+bottle",
    image: "https://images.pexels.com/photos/4000090/pexels-photo-4000090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
    badges: ["Plastic-Free", "Durable"],
    whyBetter: "Replaces hundreds of single-use plastic bottles every year.",
  },
  {
    id: "p8",
    name: "Solar Garden Lights",
    brand: "SolarGlow",
    category: "Home Energy",
    aqiImpact: "Low",
    co2SavedKg: 12,
    rating: 4.3,
    price: 1299,
    link: "https://www.amazon.in/s?k=solar+garden+lights",
    image: "https://images.pexels.com/photos/16632420/pexels-photo-16632420/free-photo-of-solar-lamp-in-garden.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    badges: ["Zero Energy", "Auto-Sensor"],
    whyBetter: "Lights up your garden using free solar energy, zero electricity cost.",
  },
  {
    id: "p9",
    name: "Beeswax Food Wraps",
    brand: "Apiary",
    category: "Groceries",
    aqiImpact: "Low",
    co2SavedKg: 2,
    rating: 4.5,
    price: 599,
    link: "https://www.amazon.in/s?k=beeswax+food+wraps",
    image: "https://images.pexels.com/photos/8250916/pexels-photo-8250916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    badges: ["Biodegradable", "Washable"],
    whyBetter: "Natural alternative to plastic cling wrap, keeps food fresh effectively.",
  },
  {
    id: "p10",
    name: "Rechargeable Batteries",
    brand: "PowerLoop",
    category: "Electronics",
    aqiImpact: "Medium",
    co2SavedKg: 5,
    rating: 4.4,
    price: 899,
    link: "https://www.amazon.in/s?k=rechargeable+batteries",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop",
    badges: ["Less E-Waste", "Long Life"],
    whyBetter: "One rechargeable battery replaces up to 1000 single-use alkaline batteries.",
  },
  {
    id: "p11",
    name: "Compost Bin",
    brand: "EarthCycle",
    category: "Home Energy",
    aqiImpact: "Medium",
    co2SavedKg: 45,
    rating: 4.7,
    price: 1499,
    link: "https://www.amazon.in/s?k=compost+bin",
    image: "https://images.pexels.com/photos/6508357/pexels-photo-6508357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    badges: ["Waste Reduction", "Fertilizer"],
    whyBetter: "Turns kitchen scraps into nutrient-rich soil, reducing landfill methane emissions.",
  },
  {
    id: "p12",
    name: "Bamboo Cutlery Set",
    brand: "EcoTravel",
    category: "Travel",
    aqiImpact: "Low",
    co2SavedKg: 1.5,
    rating: 4.3,
    price: 349,
    link: "https://www.amazon.in/s?k=bamboo+cutlery+set",
    image: "https://images.pexels.com/photos/4202392/pexels-photo-4202392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    badges: ["Lightweight", "Reusable"],
    whyBetter: "Perfect for travel and office lunches, avoiding disposable plastic cutlery.",
  }
];

const Tag = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
    {children}
  </span>
);

const Rating = ({ value }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < full ? "fill-yellow-400" : half && i === full ? "fill-yellow-400/60" : ""}`} />
      ))}
      <span className="ml-1 text-xs text-gray-400">{value.toFixed(1)}</span>
    </div>
  );
};

const ProductCard = ({ p, onAdd, onDelete }) => {
  return (
    <Card className="bg-[#0b1411] border border-green-500/20 overflow-hidden hover:border-green-400/40 transition-all duration-300 relative group">
      <div className="relative h-40 w-full overflow-hidden">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-2 left-2 flex gap-1">
          {p.badges.map((b) => (
            <Tag key={b}>{b}</Tag>
          ))}
        </div>
        <button 
          onClick={() => onDelete(p.id)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          title="Delete Product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white/90">{p.name}</h3>
            <p className="text-xs text-gray-400">{p.brand} • {p.category}</p>
          </div>
          <Rating value={p.rating} />
        </div>
        <p className="text-xs text-gray-300/80">{p.whyBetter}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-400 font-semibold">₹{p.price}</span>
          <span className="text-xs text-teal-300/80 flex items-center gap-1"><Leaf className="w-3 h-3"/> {p.co2SavedKg}kg CO₂/yr</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button onClick={() => onAdd(p)} className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 h-8 px-3 flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" /> Add
          </Button>
          <a href={p.link} target="_blank" rel="noreferrer" className="h-8 px-3 inline-flex items-center gap-1 rounded-md border border-teal-500/30 text-teal-300 hover:bg-teal-500/20">
            <ExternalLink className="w-4 h-4"/> Buy
          </a>
          <span className="ml-auto text-xs text-emerald-300/80 flex items-center gap-1"><Recycle className="w-3 h-3"/> AQI: {p.aqiImpact}</span>
        </div>
      </div>
    </Card>
  );
};

const EcoProducts = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("eco_products_v11");
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem("eco_products_v11", JSON.stringify(products));
  }, [products]);

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("impact");
  const [wishlist, setWishlist] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "Home Energy",
    price: "",
    co2SavedKg: "",
    image: "",
    whyBetter: "",
    link: ""
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const p = {
      ...newProduct,
      id: "p" + (products.length + 1) + Date.now(), // unique ID
      rating: 0,
      aqiImpact: "Low", // Default
      badges: ["New"],
      co2SavedKg: Number(newProduct.co2SavedKg) || 0,
      price: Number(newProduct.price)
    };
    setProducts([p, ...products]);
    setIsAddOpen(false);
    setNewProduct({
      name: "",
      brand: "",
      category: "Home Energy",
      price: "",
      co2SavedKg: "",
      image: "",
      whyBetter: "",
      link: ""
    });
  };

  const list = useMemo(() => {
    let items = products.filter(
      (x) => (cat === "All" || x.category === cat) && x.name.toLowerCase().includes(query.toLowerCase())
    );

    if (sort === "impact") items = items.sort((a, b) => b.co2SavedKg - a.co2SavedKg);
    if (sort === "price") items = items.sort((a, b) => a.price - b.price);
    if (sort === "rating") items = items.sort((a, b) => b.rating - a.rating);

    return items;
  }, [query, cat, sort, products]);

  const addWishlist = (p) => {
    if (!wishlist.find((w) => w.id === p.id)) setWishlist([...wishlist, p]);
  };

  return (
    <div className="min-h-screen bg-[#050a08] pb-20">
      <Navbar />

      <div className="pt-24 max-w-[1200px] mx-auto px-4">
        <div className="rounded-2xl border border-green-500/20 bg-[radial-gradient(1200px_200px_at_top,rgba(34,197,94,0.12),transparent)] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs">
                <Sparkles className="w-3 h-3"/> AI-Powered Alternatives
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-teal-400 to-blue-400">
                Eco Products — Cleaner Choices, Lower Footprint
              </h1>
              <p className="mt-2 text-gray-300/80 text-sm max-w-2xl">
                Curated items that reduce pollution generation or exposure. Sorted by CO₂ saved by default. Click Buy to open trusted marketplaces.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-auto">
               <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold shrink-0">
                    <Plus className="w-4 h-4 mr-2"/> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0b1411] border-green-500/20 text-green-100">
                  <DialogHeader>
                    <DialogTitle>Add New Eco Product</DialogTitle>
                    <DialogDescription>Share a sustainable product with the community.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="bg-black/20 border-green-500/20"/>
                      </div>
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Input value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} className="bg-black/20 border-green-500/20"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <Input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="bg-black/20 border-green-500/20"/>
                      </div>
                      <div className="space-y-2">
                         <Label>Category</Label>
                         <select 
                            value={newProduct.category} 
                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full flex h-10 items-center justify-between rounded-md border border-green-500/20 bg-black/20 px-3 py-2 text-sm text-green-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                           {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="bg-black/20 border-green-500/20" placeholder="https://..."/>
                      </div>
                       <div className="space-y-2">
                        <Label>Buy Link</Label>
                        <Input value={newProduct.link} onChange={e => setNewProduct({...newProduct, link: e.target.value})} className="bg-black/20 border-green-500/20" placeholder="https://..."/>
                      </div>
                       <div className="space-y-2">
                        <Label>Why fits better?</Label>
                        <Input value={newProduct.whyBetter} onChange={e => setNewProduct({...newProduct, whyBetter: e.target.value})} className="bg-black/20 border-green-500/20"/>
                      </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddProduct} className="bg-green-500 text-black hover:bg-green-600">Save Product</Button>
                  </DialogFooter>
                </DialogContent>
               </Dialog>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full md:w-auto">
              <div className="col-span-2 md:col-span-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search eco products..." className="bg-[#0b1411] border-green-500/20 text-green-100"/>
              </div>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="bg-[#0b1411] border border-green-500/20 rounded-md px-3 py-2 text-sm text-green-100">
                <option>All</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-[#0b1411] border border-green-500/20 rounded-md px-3 py-2 text-sm text-green-100">
                <option value="impact">Sort: Impact</option>
                <option value="price">Sort: Price</option>
                <option value="rating">Sort: Rating</option>
              </select>
            </div>
           </div>
          </div>


          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{k:"Avg. CO₂ saved/yr",v:"+32 kg"},{k:"Plastic avoided",v:"~180 bags"},{k:"Exposure drop",v:"-15% AQI"},{k:"Green score boost",v:"+90 pts"}].map(x=> (
              <Card key={x.k} className="bg-[#0b1411] border border-green-500/20 p-4">
                <p className="text-xs text-gray-400">{x.k}</p>
                <p className="text-lg font-bold text-green-300">{x.v}</p>
              </Card>
            ))}
          </div>
        </div>


        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {list.map((p) => (
            <div key={p.id} className="group">
              <ProductCard p={p} onAdd={addWishlist} onDelete={handleDeleteProduct} />
            </div>
          ))}
        </div>


        <div className="mt-10">
          <h2 className="text-lg font-semibold text-green-200 flex items-center gap-2"><Heart className="w-4 h-4"/> Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="text-sm text-gray-400 mt-2">Add items to compare and purchase later.</p>
          ) : (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {wishlist.map((w) => (
                <Card key={w.id} className="bg-[#0b1411] border border-green-500/20 p-3 flex items-center gap-3">
                  <img src={w.image} alt={w.name} className="w-16 h-12 object-cover rounded"/>
                  <div className="flex-1">
                    <p className="text-sm text-green-100">{w.name}</p>
                    <p className="text-xs text-gray-400">₹{w.price} • {w.co2SavedKg}kg CO₂/yr</p>
                  </div>
                  <a href={w.link} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border border-teal-500/30 text-teal-300 hover:bg-teal-500/20">
                    <ExternalLink className="w-3 h-3"/> Buy
                  </a>
                </Card>
              ))}
            </div>
          )}
        </div>


        <div className="mt-12 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{
            title:"Switch 5 bulbs to LED",
            desc:"Saves ~75% energy per bulb and pays back within months.",
          },{
            title:"Carry a tote",
            desc:"Skip plastic at stores. One tote replaces 150+ bags/year.",
          },{
            title:"Prefer metro on high-AQI days",
            desc:"Lower exposure and emissions versus car/bike.",
          }].map(t => (
            <Card key={t.title} className="bg-[#0b1411] border border-green-500/20 p-5">
              <h3 className="text-green-200 font-semibold flex items-center gap-2"><Filter className="w-4 h-4"/> {t.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoProducts;