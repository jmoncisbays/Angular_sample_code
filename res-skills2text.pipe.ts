import { Pipe } from "@angular/core";
import { Skill } from "../../model/skill.model";

@Pipe({
    name: "skillsToString"
})
export class resSkillsToString {
    private skills: string[];

    transform(value: Skill[]): string {
        this.skills = [];
        value.forEach(s => this.skills.push(s.name));
        return this.skills.join(", ");
    }
}