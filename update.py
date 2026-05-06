import os
import re

files_to_update = [
    r"src\app\pages\BookingPage.jsx",
    r"src\app\pages\AdventureSelector.jsx"
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # family -> group in packages
    content = content.replace('"Family Fun Ride"', '"Group Fun Ride"')
    content = content.replace('"Family Deluxe Experience"', '"Group Deluxe Experience"')
    content = content.replace('"Family Celebration Package"', '"Group Celebration Package"')
    content = content.replace('"Family Montage Video"', '"Group Montage Video"')
    content = content.replace('title: "Family"', 'title: "Group"')
    content = content.replace('microText: "Family Bonding"', 'microText: "Group Bonding"')
    content = content.replace('Add Family Member', 'Add Group Member')

    # Couple packages removal (simple approach: remove them from the array completely)
    # Actually, people might still want to select it if it's in the CATEGORIES list?
    # No, we need to remove the CATEGORIES block for COUPLE.
    # It's better to just regex remove the whole COUPLE category block.
    content = re.sub(r'\{\s*id:\s*"COUPLE".*?cta:\s*"Book Now",\s*\},', '', content, flags=re.DOTALL)
    
    # VIP -> Express Check-in
    content = content.replace('VIP Check-in', 'Express Check-in')

    # Gender adding 'O'
    content = content.replace('<option value="M">Male</option>\n                                                    <option value="F">Female</option>', '<option value="M">Male</option>\n                                                    <option value="F">Female</option>\n                                                    <option value="O">Other</option>')
    
    # We must also change the toggle buttons for gender: M and F.
    content = re.sub(
        r"\{\['M', 'F'\]\.map\(\(g\)",
        "{['M', 'F', 'O'].map((g)",
        content
    )

    # Change GST to CGST and SGST in the UI
    content = content.replace(
        '''                                        <div className="flex justify-between border-b pb-4 mb-2 border-white/10 text-white/50">
                                            <span>GST (18%)</span>
                                            <span className="text-white">Rs. {calcTotal().gst}</span>
                                        </div>''',
        '''                                        <div className="flex justify-between mt-2 pt-2 border-t border-white/10 text-white/50">
                                            <span>CGST (9%)</span>
                                            <span className="text-white">Rs. {calcTotal().gst / 2}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-4 mb-2 border-white/10 text-white/50">
                                            <span>SGST (9%)</span>
                                            <span className="text-white">Rs. {calcTotal().gst / 2}</span>
                                        </div>'''
    )

    # Change GST in JS PDF ticket
    content = content.replace(
        '''        doc.text("GST (18%)", 15, y);
        doc.text(`Rs. ${calc.gst.toFixed(2)}`, 85, y, { align: "right" });
        y += 8;''',
        '''        doc.text("CGST (9%)", 15, y);
        doc.text(`Rs. ${(calc.gst/2).toFixed(2)}`, 85, y, { align: "right" });
        y += 6;
        doc.text("SGST (9%)", 15, y);
        doc.text(`Rs. ${(calc.gst/2).toFixed(2)}`, 85, y, { align: "right" });
        y += 8;'''
    )

    content = content.replace(
        '''        doc.text("GST (18%)", 15, y);
        doc.text(calc.gst.toFixed(0), 85, y, { align: "right" });
        y += 8;''',
        '''        doc.text("CGST (9%)", 15, y);
        doc.text((calc.gst/2).toFixed(0), 85, y, { align: "right" });
        y += 6;
        doc.text("SGST (9%)", 15, y);
        doc.text((calc.gst/2).toFixed(0), 85, y, { align: "right" });
        y += 8;'''
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated Booking and Adventure pages successfully.")
