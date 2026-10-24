/** Milestone 1. Future rule incidents and narrative records must use distinct discriminated types. */
export type RegionId = 'punjab'|'delhi'|'bengal'|'bombay'|'maratha'|'hyderabad'|'mysore'|'madras';
export type Presidency = 'bombay'|'madras'|'bengal';
export interface RegionState {
 control: 'indian'|'company'; presidency: Presidency|null; overlord: RegionId|null;
 strength: number; unrest: number; lootAvailable: boolean; orders: Record<string,boolean>;
}
export interface Correction {kind:'correction'|'setup';title:string;turn:number;at:string;}
export interface GameState {
 schemaVersion:1;scenario:'1710';campaignName:string;turn:number;chinaOffice:boolean;
 laws:{royalProtection:boolean;governorGeneral:boolean;envoyChina:boolean;zamindarTaxes:boolean;treasureReform:boolean};
 elephant:{from:RegionId;to:RegionId|null};regions:Record<RegionId,RegionState>;history:Correction[];
}
export interface SavedCampaign {format:'john-company-india';version:1;state:GameState;undo:GameState[];}
/** Planned action snapshot, not an army roster. */
export interface DeploymentReport {army:Presidency;target:RegionId;regiments:number;officers:number;allianceIds:string[];outcome:'success'|'failure'|'catastrophicFailure';officersLost:number;}
