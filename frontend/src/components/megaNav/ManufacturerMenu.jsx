// src/components/ManufacturerMenu.jsx
import React from "react";

const ManufacturerMenu = () => {
  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Manufacturing Services
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/manufacturer/oem"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              OEM Services
            </a>
          </li>
          <li>
            <a
              href="/manufacturer/custom"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Custom Manufacturing
            </a>
          </li>
          <li>
            <a
              href="/manufacturer/prototyping"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Prototyping
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Product Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/manufacturer/electronics"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Electronics
            </a>
          </li>
          <li>
            <a
              href="/manufacturer/apparel"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Apparel
            </a>
          </li>
          <li>
            <a
              href="/manufacturer/machinery"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Machinery
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-[var(--color-heading)] mb-2">
          Resources
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="/manufacturer/guides"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Manufacturing Guides
            </a>
          </li>
          <li>
            <a
              href="/manufacturer/certifications"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Certifications
            </a>
          </li>
          <li>
            <a
              href="/manufacturer/partnerships"
              className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
            >
              Partnership Programs
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ManufacturerMenu;