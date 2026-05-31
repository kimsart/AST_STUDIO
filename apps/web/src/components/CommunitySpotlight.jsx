import portrait from '../assets/studiospotlight/kevinlewis/portrait-01.jpg'
import artwork01 from '../assets/studiospotlight/kevinlewis/artwork-01.jpg'
import artwork02 from '../assets/studiospotlight/kevinlewis/artwork-02.jpg'
import artwork03 from '../assets/studiospotlight/kevinlewis/artwork-03.jpg'
import artwork04 from '../assets/studiospotlight/kevinlewis/artwork-04.jpg'
import studio from '../assets/studiospotlight/kevinlewis/studio-01.jpeg'

const artworks = [artwork01, artwork02, artwork03, artwork04]

export default function CommunitySpotlight() {
  return (
    <div className="bg-[#120724] border border-ast_blue/20 rounded-xl p-4">
      <h2 className="text-sm font-bold text-ast_pink/70 mb-4 tracking-wide">STUDIO SPOTLIGHT</h2>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={portrait}
          alt="Kevin Lewis"
          className="w-12 h-12 rounded-full object-cover border border-ast_blue/30 shrink-0"
        />
        <div>
          <h3 className="font-bold text-ast_turquoise text-sm">Kevin Lewis</h3>
          <p className="text-xs text-ast_body/65">Mixed media &amp; textile artist</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {artworks.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Artwork ${i + 1}`}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>

      <img
        src={studio}
        alt="Kevin Lewis's studio"
        className="w-full h-16 object-cover rounded-lg opacity-60 mb-4"
      />

      <button className="w-full text-ast_turquoise text-xs font-medium hover:text-ast_turquoise/80 transition py-2">
        View Profile →
      </button>
    </div>
  )
}
