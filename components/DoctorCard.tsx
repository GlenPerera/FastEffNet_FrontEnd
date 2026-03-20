import Image from "next/image";

interface DoctorProps {
  name: string;
  role: string;
  experience: string;
  tag: string;
  tagColor: string;
  imageSrc?: string;
}

export default function DoctorCard({
  name,
  role,
  experience,
  tag,
  tagColor,
  imageSrc,
}: DoctorProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .doc-card {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          padding: 20px;
          transition: transform .2s, box-shadow .2s;
          display: flex; flex-direction: column;
        }
        .doc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.09);
        }
        .doc-top { display: flex; gap: 14px; margin-bottom: 16px; align-items: center; }
        .doc-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          overflow: hidden; flex-shrink: 0;
          border: 2px solid #e8edf3; background: #f1f5f9;
        }
        .doc-info { flex: 1; min-width: 0; }
        .doc-name {
          font-size: 15px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.2px; margin-bottom: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .doc-meta {
          font-size: 12px; color: #94a3b8; font-weight: 400; margin-bottom: 6px;
        }
        .doc-tag {
          display: inline-block;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 3px 9px; border-radius: 6px;
        }
        .doc-divider {
          height: 1px; background: #f1f5f9; margin-bottom: 14px;
        }
        .doc-stats {
          display: flex; gap: 12px; margin-bottom: 16px;
        }
        .doc-stat {
          flex: 1; background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 10px; padding: 10px 12px; text-align: center;
        }
        .doc-stat-val {
          font-size: 15px; font-weight: 700; color: #0f172a;
        }
        .doc-stat-lbl {
          font-size: 10px; color: #94a3b8; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;
        }
        .doc-btn {
          width: 100%; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 600; color: #fff;
          background: #1d4ed8; border: none; cursor: pointer;
          padding: 12px; border-radius: 10px;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 14px rgba(29,78,216,0.18);
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .doc-btn:hover { background: #1e40af; transform: translateY(-1px); }
      `}</style>

      <div className="doc-card">
        <div className="doc-top">
          <div className="doc-avatar">
            <Image
              src={imageSrc || "/images/avatar1.png"}
              alt={name}
              width={52}
              height={52}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="doc-info">
            <div className="doc-name">{name}</div>
            <div className="doc-meta">
              {role} · {experience}
            </div>
            <span className={`doc-tag ${tagColor}`}>{tag}</span>
          </div>
        </div>

        <div className="doc-divider" />

        <div className="doc-stats">
          <div className="doc-stat">
            <div className="doc-stat-val">4.9</div>
            <div className="doc-stat-lbl">Rating</div>
          </div>
          <div className="doc-stat">
            <div className="doc-stat-val">120+</div>
            <div className="doc-stat-lbl">Patients</div>
          </div>
          <div className="doc-stat">
            <div className="doc-stat-val">Mon–Fri</div>
            <div className="doc-stat-lbl">Available</div>
          </div>
        </div>

        <button className="doc-btn">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Book Appointment
        </button>
      </div>
    </>
  );
}
