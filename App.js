import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import jsPDF from "jspdf";

export default function QuotationBuilder() {
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState([{ description: "", qty: 1, price: 0 }]);
  const [terms, setTerms] = useState(`Quotation Validity: 15 days from date of issue.
Payment Terms: 50% advance, balance upon delivery.
Cancellation: Orders cannot be cancelled after acceptance.
Force Majeure: We are not liable for delays due to unforeseen circumstances.
PO Acceptance: Purchase Order must match quoted terms.
Changes to Order: Subject to approval and may affect cost/time.
Acknowledgment: Client agrees to terms upon signing.
VAT: Prices are exclusive of VAT unless stated.
Lead Time: 7-10 business days post PO.
Commencement: Work begins after PO and advance.`);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", qty: 1, price: 0 }]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const vat = subtotal * 0.10;
  const total = subtotal + vat;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("MMS (MUNIR MOHAMMED AL SHAKHURI W.L.L)", 10, 10);
    doc.setFontSize(12);
    doc.text(`Quotation for: ${clientName}`, 10, 20);

    let y = 30;
    items.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.description} | Qty: ${item.qty} | Price: ${item.price.toFixed(3)} BHD`, 10, y);
      y += 10;
    });

    y += 10;
    doc.text(`Subtotal: ${subtotal.toFixed(3)} BHD`, 10, y);
    y += 10;
    doc.text(`VAT (10%): ${vat.toFixed(3)} BHD`, 10, y);
    y += 10;
    doc.text(`Total: ${total.toFixed(3)} BHD`, 10, y);

    y += 20;
    doc.setFontSize(10);
    const termsArray = terms.split("\n");
    termsArray.forEach((line) => {
      doc.text(line, 10, y);
      y += 7;
    });

    doc.save(`${clientName}_quotation.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quotation Creator (BHD)</h1>
      <Card>
        <CardContent className="space-y-4">
          <Input
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <h2 className="text-lg font-semibold">Items</h2>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(i, "description", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(i, "qty", parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Price (BHD)"
                value={item.price}
                onChange={(e) => handleItemChange(i, "price", parseFloat(e.target.value))}
              />
            </div>
          ))}
          <Button onClick={addItem}>Add Item</Button>
          <div className="space-y-1">
            <p>Subtotal: {subtotal.toFixed(3)} BHD</p>
            <p>VAT (10%): {vat.toFixed(3)} BHD</p>
            <p className="font-semibold">Total: {total.toFixed(3)} BHD</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Terms & Conditions</h2>
          <Textarea
            rows={10}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </CardContent>
      </Card>
      <Button className="mt-4" onClick={exportPDF}>
        Export PDF
      </Button>
    </div>
  );
}