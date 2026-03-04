// AssessmentTab.jsx — Assessment tab layout
import AssessmentForm from "../assessment/AssessmentForm";
import PostureDiagram from "../assessment/PostureDiagram";

export default function AssessmentTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Form — takes 2/3 width on md+ */}
      <div className="md:col-span-2">
        <AssessmentForm />
      </div>
      {/* Diagram — takes 1/3 width on md+ */}
      <div className="md:col-span-1">
        <PostureDiagram />
      </div>
    </div>
  );
}
