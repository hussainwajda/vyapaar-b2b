// src/components/CategoriesMenu.jsx
import React from "react";

const CategoriesMenu = () => {
  return (
    <div className="p-6 grid grid-cols-4 gap-6">
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Electronics
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/categories/electronics/mobile"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Mobile Phones
            </a>
          </li>
          <li>
            <a
              href="/categories/electronics/laptops"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Laptops & PCs
            </a>
          </li>
          <li>
            <a
              href="/categories/electronics/accessories"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Accessories
            </a>
          </li>
          <li>
            <a
              href="/categories/electronics/audio"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Audio Devices
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Fashion
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/categories/fashion/men"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Men's Clothing
            </a>
          </li>
          <li>
            <a
              href="/categories/fashion/women"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Women's Clothing
            </a>
          </li>
          <li>
            <a
              href="/categories/fashion/kids"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Kids' Fashion
            </a>
          </li>
          <li>
            <a
              href="/categories/fashion/accessories"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Fashion Accessories
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Home & Garden
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/categories/home/furniture"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Furniture
            </a>
          </li>
          <li>
            <a
              href="/categories/home/decor"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Home Decor
            </a>
          </li>
          <li>
            <a
              href="/categories/home/kitchen"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Kitchen Appliances
            </a>
          </li>
          <li>
            <a
              href="/categories/home/garden"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Garden Supplies
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Industrial
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/categories/industrial/machinery"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Machinery
            </a>
          </li>
          <li>
            <a
              href="/categories/industrial/tools"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Tools & Hardware
            </a>
          </li>
          <li>
            <a
              href="/categories/industrial/chemicals"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Chemicals
            </a>
          </li>
          <li>
            <a
              href="/categories/industrial/components"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Industrial Components
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategoriesMenu;