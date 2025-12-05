import { useState } from 'react';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { fallbackProblemIndex } from '../user/ViewProblems';

export default function ImportFallbackData() {
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState('');
    const [importedCount, setImportedCount] = useState(0);

    const importData = async () => {
        setImporting(true);
        setMessage('Starting import...');
        setImportedCount(0);

        try {
            // First, check what's already in Firestore
            const existingProblemsSnap = await getDocs(collection(db, 'problems'));
            const existingProblems = existingProblemsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            let count = 0;
            let skipped = 0;

            // Convert fallbackProblemIndex object to array
            const fallbackProblems = Object.values(fallbackProblemIndex);

            for (const problem of fallbackProblems) {
                // Check if this problem already exists (by title and vehicle type)
                const isDuplicate = existingProblems.some(
                    existing =>
                        existing.title === problem.title &&
                        existing.vehicleType === problem.vehicleType
                );

                if (isDuplicate) {
                    skipped++;
                    setMessage(`Imported ${count}, Skipped ${skipped} duplicates...`);
                    continue; // Skip this problem
                }

                // First, create the solution
                const solutionDoc = await addDoc(collection(db, 'solutions'), {
                    description: problem.solution.description,
                    videoLink: problem.solution.videoLink,
                    steps: problem.solution.steps || [],
                    tools: problem.solution.tools || [],
                    precautions: problem.solution.precautions || '',
                    createdAt: new Date()
                });

                // Then create the problem with the solution reference
                await addDoc(collection(db, 'problems'), {
                    title: problem.title,
                    vehicleType: problem.vehicleType,
                    description: problem.description,
                    solutionId: solutionDoc.id,
                    createdAt: new Date()
                });

                count++;
                setImportedCount(count);
                setMessage(`Imported ${count}, Skipped ${skipped} duplicates...`);
            }

            if (skipped > 0) {
                setMessage(`✅ Import complete! Added ${count} new problems, skipped ${skipped} duplicates.`);
            } else {
                setMessage(`✅ Successfully imported all ${count} problems and their solutions!`);
            }
        } catch (error) {
            console.error('Import error:', error);
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setImporting(false);
        }
    };

    const checkExisting = async () => {
        try {
            const problemsSnap = await getDocs(collection(db, 'problems'));
            const solutionsSnap = await getDocs(collection(db, 'solutions'));

            setMessage(`Current database: ${problemsSnap.size} problems, ${solutionsSnap.size} solutions`);
        } catch (error) {
            setMessage(`Error checking database: ${error.message}`);
        }
    };

    const totalFallbackProblems = Object.keys(fallbackProblemIndex).length;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📦 Import Existing Problems</h1>
                <p>Import all the fallback problems and solutions into Firestore database</p>
            </div>

            <div className="card">
                <h2>Import Status</h2>

                <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px', marginBottom: '2rem' }}>
                    <strong>📊 Available to Import:</strong>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0.5rem 0' }}>
                        {totalFallbackProblems} Problems
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        These are the hardcoded problems currently shown to users
                    </p>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        background: message.includes('Error') || message.includes('❌') ? '#fee2e2' :
                            message.includes('✅') ? '#d1fae5' : '#fef3c7',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        color: message.includes('Error') || message.includes('❌') ? '#991b1b' :
                            message.includes('✅') ? '#065f46' : '#854d0e'
                    }}>
                        {message}
                    </div>
                )}

                {importing && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: '#e2e8f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${(importedCount / totalFallbackProblems) * 100}%`,
                                height: '100%',
                                background: '#2563eb',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#64748b' }}>
                            {importedCount} / {totalFallbackProblems}
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={checkExisting}
                        className="btn btn-secondary"
                        disabled={importing}
                    >
                        📊 Check Current Database
                    </button>

                    <button
                        onClick={importData}
                        className="btn btn-primary"
                        disabled={importing}
                        style={{ flex: 1 }}
                    >
                        {importing ? '⏳ Importing...' : '📦 Import All Problems'}
                    </button>
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: '#dbeafe',
                    borderRadius: '8px',
                    border: '1px solid #93c5fd'
                }}>
                    <strong>✅ Smart Import:</strong>
                    <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
                        <li>Automatically checks for existing problems before importing</li>
                        <li>Skips duplicates (matches by title + vehicle type)</li>
                        <li>Safe to run multiple times - won't create duplicates!</li>
                        <li>You can run this anytime to sync new problems</li>
                        <li>After import, manage them from "Problems & Solutions" page</li>
                    </ul>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>What happens after import?</h3>
                <ol style={{ lineHeight: '2' }}>
                    <li>All {totalFallbackProblems} problems will be added to Firestore</li>
                    <li>Each problem will have its solution linked automatically</li>
                    <li>They'll appear in the admin dashboard counts</li>
                    <li>You can edit/delete them from "Problems & Solutions" page</li>
                    <li>Users will continue to see them (from both Firestore and fallback data)</li>
                </ol>
            </div>
        </div>
    );
}
