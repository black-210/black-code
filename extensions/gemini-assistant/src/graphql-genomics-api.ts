import * as http from 'http';

interface Gene {
  id: string;
  name: string;
  sequence: string;
  chromosome: string;
  position: number;
  length: number;
  geneType: string;
  annotations: string[];
}

interface GenomicAnalysis {
  sequenceLength: number;
  gcContent: number;
  codingRegions: number;
  annotatedGenes: number;
  mutations: Mutation[];
}

interface Mutation {
  position: number;
  original: string;
  variant: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
}

interface GraphQLQuery {
  operationName: string;
  query: string;
  variables?: Record<string, any>;
}

class GenomicsAPI {
  private genes: Map<string, Gene> = new Map();
  private sequences: Map<string, string> = new Map();
  private analysisCache: Map<string, GenomicAnalysis> = new Map();

  constructor(private port: number = 4000) {}

  start() {
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.url === '/graphql' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
          try {
            const query = JSON.parse(body) as GraphQLQuery;
            const result = this.executeQuery(query);
            res.writeHead(200);
            res.end(JSON.stringify(result));
          } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: (error as Error).message }));
          }
        });
      } else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', service: 'GenomicsAPI' }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });

    server.listen(this.port, () => {
      console.log(`🧬 Genomics API running at http://localhost:${this.port}/graphql`);
    });
  }

  private executeQuery(query: GraphQLQuery) {
    const { query: queryStr, variables } = query;

    if (queryStr.includes('addGene')) {
      return this.handleAddGene(variables);
    } else if (queryStr.includes('getGene')) {
      return this.handleGetGene(variables);
    } else if (queryStr.includes('analyzeSequence')) {
      return this.handleAnalyzeSequence(variables);
    } else if (queryStr.includes('listGenes')) {
      return this.handleListGenes();
    } else if (queryStr.includes('detectMutations')) {
      return this.handleDetectMutations(variables);
    } else if (queryStr.includes('gcContent')) {
      return this.handleGCContent(variables);
    }

    return { error: 'Unknown query' };
  }

  private handleAddGene(variables?: any) {
    if (!variables) return { error: 'Missing variables' };

    const { id, name, sequence, chromosome, position, geneType } = variables;
    const gene: Gene = {
      id,
      name,
      sequence,
      chromosome,
      position,
      length: sequence.length,
      geneType,
      annotations: []
    };

    this.genes.set(id, gene);
    return { data: { addGene: gene } };
  }

  private handleGetGene(variables?: any) {
    if (!variables?.id) return { error: 'Missing gene ID' };

    const gene = this.genes.get(variables.id);
    return { data: { getGene: gene || null } };
  }

  private handleListGenes() {
    const genes = Array.from(this.genes.values());
    return { data: { genes } };
  }

  private handleAnalyzeSequence(variables?: any) {
    if (!variables?.sequence) return { error: 'Missing sequence' };

    const { sequence } = variables;
    const cached = this.analysisCache.get(sequence);
    if (cached) return { data: { analysis: cached } };

    const gcContent = this.calculateGCContent(sequence);
    const codingRegions = this.detectCodingRegions(sequence);
    const mutations: Mutation[] = [];

    const analysis: GenomicAnalysis = {
      sequenceLength: sequence.length,
      gcContent,
      codingRegions,
      annotatedGenes: this.genes.size,
      mutations
    };

    this.analysisCache.set(sequence, analysis);
    return { data: { analysis } };
  }

  private handleDetectMutations(variables?: any) {
    if (!variables?.reference || !variables?.sample)
      return { error: 'Missing reference or sample' };

    const { reference, sample } = variables;
    const mutations: Mutation[] = [];

    for (let i = 0; i < Math.min(reference.length, sample.length); i++) {
      if (reference[i] !== sample[i]) {
        mutations.push({
          position: i,
          original: reference[i],
          variant: sample[i],
          impact: i % 3 === 0 ? 'HIGH' : i % 2 === 0 ? 'MEDIUM' : 'LOW',
          type: 'SNP'
        });
      }
    }

    return { data: { mutations } };
  }

  private handleGCContent(variables?: any) {
    if (!variables?.sequence) return { error: 'Missing sequence' };

    const gcContent = this.calculateGCContent(variables.sequence);
    return { data: { gcContent } };
  }

  private calculateGCContent(sequence: string): number {
    const gc = sequence.match(/[GC]/gi) || [];
    return (gc.length / sequence.length) * 100;
  }

  private detectCodingRegions(sequence: string): number {
    let count = 0;
    for (let i = 0; i < sequence.length - 2; i += 3) {
      const codon = sequence.substring(i, i + 3);
      if (this.isStartCodon(codon)) count++;
    }
    return count;
  }

  private isStartCodon(codon: string): boolean {
    return codon.toUpperCase() === 'ATG';
  }
}

const api = new GenomicsAPI(4000);
api.start();

export { GenomicsAPI, Gene, GenomicAnalysis, Mutation };
